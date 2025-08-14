import Joi, { ObjectSchema } from "joi";
import { allowedCategoryCodes } from "../types/book.type";
import i18n from "../utils/i18next";
import { Author } from "@prisma/client";
import { allowedCountries } from "../utils/constant";

export type AuthorWithPopularity = Author & { popularity: number };

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

export const getAllAuthorsPagingSchema: ObjectSchema<GetAllAuthorsPaging> =
  Joi.object({
    search: Joi.string().allow("").optional(),
    country: Joi.string()
      .valid(...allowedCountries)
      .allow("All")
      .default("All")
      .optional(),
    sortBy: Joi.string()
      .valid(...allowedSortFields)
      .default("created_at DESC"),
    category: Joi.string()
      .valid(...allowedCategoryCodes)
      .allow("All")
      .default("All")
      .messages({
        "any.only": i18n.t("errorMessages.invalidCategoryCode"),
        "string.base": i18n.t("errorMessages.categoryMustBeString"),
      }),
    page_index: Joi.number().integer().min(1).default(1),
  });

//Search authors by name for uploading book
export type SearchAuthorsByName = {
  name: string;
};

export const searchAuthorsByNameSchema: ObjectSchema<SearchAuthorsByName> =
  Joi.object({
    name: Joi.string()
      .required()
      .messages({
        "string.base": i18n.t("errorMessages.authorNameMustBeString"),
        "any.required": i18n.t("errorMessages.authorNameIsRequired"),
      }),
  });

//Create author schema
export type CreateAuthor = {
  name: string;
  country: string;
};

export const createAuthorSchema: ObjectSchema<CreateAuthor> = Joi.object({
  name: Joi.string()
    .required()
    .allow(null)
    .min(3)
    .trim()
    .messages({
      "string.base": i18n.t("errorMessages.authorNameMustBeString"),
      "any.required": i18n.t("errorMessages.authorNameIsRequired"),
      "string.min": i18n.t("errorMessages.authorNameTooShort"),
    }),
  country: Joi.string()
    .valid(...allowedCountries)
    .allow(null)
    .required()
    .trim()
    .messages({
      "string.base": i18n.t("errorMessages.authorCountryMustBeString"),
      "any.required": i18n.t("errorMessages.authorCountryIsRequired"),
      "any.only": i18n.t("errorMessages.invalidCountry"), // Add this
    }),
});
