import i18n from "../utils/i18next";
import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
  email: Yup.string().email().required(i18n.t("errorMessages.emailIsRequired")),
  password: Yup.string().required(i18n.t("errorMessages.passwordIsRequired")),
});

export const registerValidationSchema = Yup.object({
  username: Yup.string()
    .required(i18n.t("errorMessages.usernameIsRequired"))
    .max(51, i18n.t("errorMessages.usernameIsTooLong"))
    .trim(),
  email: Yup.string()
    .email(i18n.t("errorMessages.invalidEmail"))
    .required(i18n.t("errorMessages.emailIsRequired"))
    .trim(),
  password: Yup.string()
    .required(i18n.t("errorMessages.passwordIsRequired"))
    .min(8, i18n.t("errorMessages.weakPassword"))
    .max(32, i18n.t("errorMessages.tooLongPassword"))
    .trim(),
  confirm_password: Yup.string()
    .required(i18n.t("errorMessages.confirmPasswordIsRequired"))
    .oneOf(
      [Yup.ref("password")],
      i18n.t("errorMessages.confirmPasswordNotMatch")
    )
    .trim(),
});
