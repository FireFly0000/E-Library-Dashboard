import apiCaller from "@/api-config/axiosInstance";
import { Register as RegisterType, Login as LoginType } from "../types/auth";
import i18n from "../utils/i18next";

const register = async (values: RegisterType) => {
  const path = "/auth/register";

  const data: RegisterType = {
    username: values.username,
    email: values.email,
    password: values.password,
    confirm_password: values.confirm_password,
  };

  const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_POST"), path, data);
  return response;
};

//Call refresh directly in axiosInstance config
/*
const refreshToken = async () => {
  const path = "auth/refresh";

  const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

  return response;
};*/

const verifyEmail = async (token: string) => {
  const path = `auth/verify/${token}`;

  const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

  return response;
};

const resendVerifyEmail = async (token: string) => {
  const path = `auth/resend-verification/${token}`;

  const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

  return response;
};

const getMe = async () => {
  const path = "auth/me";
  const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);
  return response;
};

const login = async (values: LoginType) => {
  const path = "auth/login";
  const data: LoginType = {
    email: values.email,
    password: values.password,
  };

  const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_POST"), path, data);
  return response;
};

const logout = async () => {
  const path = "auth/logout";

  const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);
  return response;
};

export { register, verifyEmail, resendVerifyEmail, getMe, login, logout };
