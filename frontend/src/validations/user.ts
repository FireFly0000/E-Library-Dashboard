import i18n from "../utils/i18next";
import * as Yup from "yup";

export const changeUserBasicInfoValidationSchema = Yup.object({
  username: Yup.string()
    .max(51, i18n.t("errorMessages.usernameIsTooLong"))
    .trim(),
});

export const emailUpdateValidationSchema = Yup.object({
  email: Yup.string().email(i18n.t("errorMessages.invalidEmail")).trim(),
  password: Yup.string(),
});

export const changePasswordValidationSchema = Yup.object({
  currentPassword: Yup.string().trim(),
  newPassword: Yup.string()
    .min(8, i18n.t("errorMessages.weakPassword"))
    .max(32, i18n.t("errorMessages.tooLongPassword"))
    .trim(),
  confirmNewPassword: Yup.string()
    .oneOf(
      [Yup.ref("newPassword")],
      i18n.t("errorMessages.confirmPasswordNotMatch")
    )
    .trim(),
});
