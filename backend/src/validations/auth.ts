import Joi, { ObjectSchema } from "joi";

import i18n from "../utils/i18next";

type Registration = {
  email: string;
  password: string;
  username: string;
};

export const registrationSchema: ObjectSchema<Registration> = Joi.object({
  email: Joi.string()
    .trim()
    .regex(/^\S+@\S+\.\S+$/)
    .required()
    .messages({
      "string.base": i18n.t("errorMessages.emailMustBeString"),
      "any.required": i18n.t("errorMessages.emailIsRequired"),
      "string.regex": i18n.t("errorMessages.invalidEmail"),
    }),

  password: Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": i18n.t("errorMessages.passwordMustBeString"),
      "any.required": i18n.t("errorMessages.passwordIsRequired"),
    }),

  username: Joi.string()
    .trim()
    .max(51)
    .required()
    .messages({
      "string.base": i18n.t("errorMessages.UsernameMustBeString"),
      "string.max": i18n.t("errorMessages.tooLongUsername"),
      "any.required": i18n.t("errorMessages.UsernameIsRequired"),
    }),
  // confirmPassword: Joi.string().valid(Joi.ref("password")).required().strict(),

  confirm_password: Joi.string()
    .trim()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": i18n.t("errorMessages.confirmPasswordDifferentPassword"),
      "any.required": i18n.t("errorMessages.confirmPasswordIsRequired"),
    }),
});

type Login = {
  email: string;
  password: string;
};

export const loginSchema: ObjectSchema<Login> = Joi.object({
  email: Joi.string()
    .trim()
    .regex(/^\S+@\S+\.\S+$/)
    .required()
    .messages({
      "string.base": i18n.t("errorMessages.emailMustBeString"),
      "any.required": i18n.t("errorMessages.emailIsRequired"),
      "string.regex": i18n.t("errorMessages.invalidEmail"),
    }),

  password: Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": i18n.t("errorMessages.passwordMustBeString"),
      "any.required": i18n.t("errorMessages.passwordIsRequired"),
    }),
});
