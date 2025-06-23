import axios from "axios";
import Cookies from "js-cookie";
import type { InternalAxiosRequestConfig } from "axios";
import { AuthApis } from "@/apis";
import i18n from "@/utils/i18next";
import type { AxiosError } from "axios";
import { Response } from "@/types/response";
import store from "@/redux/store";
import { authActions } from "@/redux/slices";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

const axiosInstance = axios.create();

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
    console.log(config._retry);
    if (error?.response?.status === 401 && !config._retry) {
      config._retry = true;
      const response = await AuthApis.refreshToken();
      const accessToken = response.data.data.accessToken;
      if (accessToken) {
        Cookies.set("accessToken", accessToken);
        console.log(response.data.data.refreshToken);
        Cookies.set("refreshToken", response.data.data.refreshToken);
        config.headers.set("Authorization", `Bearer ${accessToken}`);
        return axiosInstance(config);
      }
    }

    if (
      error.response &&
      error.response.data &&
      (error.response.data as Response<unknown>).message ===
        i18n.t("errorMessages.loginAgain")
    ) {
      console.log("error refresh", error.response);
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
  const refreshToken = Cookies.get("refreshToken");
  return axiosPublic({
    method,
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      refreshToken: `rfToken=${refreshToken}`,
    },
    url: `${path}`,
    data,
    //withCredentials: true,
  });
};

export default apiCaller;
