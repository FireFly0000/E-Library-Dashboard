import axios from "axios";
import Cookies from "js-cookie";
import type {
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import i18n from "@/utils/i18next";
import type { AxiosError } from "axios";
import { Response } from "@/types/response";
import store from "@/redux/store";
import { authActions } from "@/redux/slices";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const baseURL = import.meta.env.VITE_BASE_URL;

const axiosPublic = axios.create({
  baseURL: baseURL,
});

axiosPublic.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosPublic.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error?.config as CustomAxiosRequestConfig;
    if (error?.response?.status === 401 && !config._retry) {
      config._retry = true;
      try {
        const response = await axios.get(`${baseURL}/auth/refresh`, {
          withCredentials: true,
        });
        const accessToken = response.data.data.accessToken;
        if (accessToken) {
          Cookies.set("accessToken", accessToken);
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
          };
          return axiosPublic(config);
        }
      } catch (refreshError) {
        const error = refreshError as AxiosResponse;
        store.dispatch(authActions.logout()); // need to use store outside of component
        Cookies.remove("accessToken");
        window.location.href = "/";
        return Promise.reject(error);
      }
    }

    if (
      (error.response &&
        error.response.data &&
        (error.response.data as Response<unknown>).message ===
          i18n.t("errorMessages.loginAgain")) ||
      i18n.t("errorMessages.badRequest")
    ) {
      store.dispatch(authActions.logout()); // need to use store outside of component
      Cookies.remove("accessToken");
      window.location.href = "/";
    }

    return Promise.reject(error.response);
  }
);

export const apiCaller = (
  method: string,
  path: string,
  data?: Record<string, unknown>
) => {
  return axiosPublic({
    method,
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
    },
    url: `${path}`,
    data,
    withCredentials: true,
  });
};

export default apiCaller;
