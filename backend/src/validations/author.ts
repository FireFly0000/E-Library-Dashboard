import Joi, { ObjectSchema } from "joi";

import i18n from "../utils/i18next";

export type GetAllAuthorsPaging = {
  search?: string;
  country?: string;
  sortBy?: string;
  page_index?: number;
  category?: string;
};

const allowedSortFields = [
  "popularity DESC",
  "created_at DESC",
  "created_at ASC",
];

const allowedCategoryCodes = [
  "FIC", // Fiction
  "SCI", // Science
  "BIO", // Biography
  "ROM", // Romance
  "FANT", // Fantasy
  "THR", // Thriller
  "HIST", // Historical
  "MYST", // Mystery
  "HORR", // Horror
];

export const getAllAuthorsPagingSchema: ObjectSchema<GetAllAuthorsPaging> =
  Joi.object({
    search: Joi.string().allow("").optional(),
    country: Joi.string().allow("").optional(),
    sortBy: Joi.string()
      .valid(...allowedSortFields)
      .default("created_at DESC"),
    category: Joi.string()
      .valid(...allowedCategoryCodes)
      .allow("")
      .optional(),
    page_index: Joi.number().integer().min(1).default(1),
  });

export type FilterAuthorsByName = {
  name: string;
  withBooks?: boolean;
};

export const filterAuthorsByNameSchema: ObjectSchema<FilterAuthorsByName> =
  Joi.object({
    name: Joi.string()
      .required()
      .messages({
        "string.base": i18n.t("errorMessages.authorNameMustBeString"),
        "any.required": i18n.t("errorMessages.authorNameIsRequired"),
      }),
    withBooks: Joi.boolean().default(false),
  });

export type CreateAuthor = {
  name: string;
  country: string;
};

export const createAuthorSchema: ObjectSchema<CreateAuthor> = Joi.object({
  name: Joi.string()
    .required()
    .min(3)
    .messages({
      "string.base": i18n.t("errorMessages.authorNameMustBeString"),
      "any.required": i18n.t("errorMessages.authorNameIsRequired"),
      "string.min": i18n.t("errorMessages.authorNameTooShort"),
    }),
  country: Joi.string()
    .required()
    .messages({
      "string.base": i18n.t("errorMessages.authorCountryMustBeString"),
      "any.required": i18n.t("errorMessages.authorCountryIsRequired"),
    }),
});
