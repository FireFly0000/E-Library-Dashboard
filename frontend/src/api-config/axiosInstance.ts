import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from "axios";
import { authActions } from "@/redux/slices";
import store from "@/redux/store";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

const baseURL = import.meta.env.VITE_BASE_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseURL,
});

let isRefreshing = false; // Track if a refresh is in progress
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response, // Pass successful responses
  async (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject(error); // Reject network errors
    }

    const originalRequest = error.config as AxiosRequestConfig;

    if (error.response.status === 401) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && typeof token === "string") {
              originalRequest.headers["Authorization"] = "Bearer " + token;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const response = await axios.get(`${baseURL}/auth/refresh`, {
          withCredentials: true,
        });
        const accessToken = response.data.data.accessToken;

        if (accessToken) {
          Cookies.set("accessToken", accessToken);
          if (originalRequest.headers) {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${accessToken}`,
            };
          }
        }

        processQueue(null, accessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        store.dispatch(authActions.logout()).then((response) => {
          if (response.payload?.status_code === 200) {
            toast.success(response.payload.message);
          } else {
            toast.error(response.payload?.message as string);
          }
        }); // need to use store outside of component
        Cookies.remove("accessToken");
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error.response);
  }
);

export const apiCaller = (
  method: string,
  path: string,
  data?: Record<string, unknown> | FormData,
  setUploadProgress?: (percent: number) => void
) => {
  return axiosInstance({
    method,
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
    },
    url: `${path}`,
    data,
    onUploadProgress: (progressEvent) => {
      const total = progressEvent.total ?? 1;
      const percent = Math.round((progressEvent.loaded * 100) / total);
      if (setUploadProgress) {
        setUploadProgress(percent);
      }
    },
    withCredentials: true,
  });
};

export const RtkBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<{
    url: string;
    method: string;
    data?: Record<string, unknown>;
  }> =>
  async ({ url, method, data }) => {
    try {
      const response = await axiosInstance({
        method,
        headers: {
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin": "*",
        },
        url: baseUrl + `${url}`,
        data,
        withCredentials: true,
      });
      return response as AxiosResponse;
    } catch (error) {
      const axiosError = error as AxiosResponse;

      return {
        error: {
          status: axiosError.status ?? 500,
          data: {
            message: axiosError.data?.message ?? "Unknown error",
            success: axiosError.data?.success,
          },
        },
      };
    }
  };
