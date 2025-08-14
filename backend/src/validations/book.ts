import Joi, { ObjectSchema } from "joi";
import { CreateAuthor as CreateAuthorType } from "./author";
import { createAuthorSchema } from "./author";
import { allowedCategoryCodes } from "../types/book.type";
import { allowedCountries } from "../utils/constant";
import i18n from "../utils/i18next";

//Create Books / bookVersions Schema ============================================
export type BookVersionSchema = {
  userId: number;
  bookId?: number;
  bookFile: Express.Multer.File;
};

export type BookSchema = {
  title?: string;
  authorId?: number;
  author?: CreateAuthorType;
  category: string;
  description?: string;
  thumbnail?: Express.Multer.File;
  bookVersion: BookVersionSchema;
};

// Schema for bookVersion
const bookVersionSchema: ObjectSchema<BookVersionSchema> = Joi.object({
  userId: Joi.number()
    .integer()
    .required()
    .messages({
      "any.required": i18n.t("errorMessages.contributorIdIsRequired"),
      "number.base": i18n.t("errorMessages.contributorIdMustBeNumber"),
    }),
  bookId: Joi.number()
    .integer()
    .allow(null)
    .optional()
    .messages({
      "number.base": i18n.t("errorMessages.bookIdMustBeNumber"),
    }),
  bookFile: Joi.required().messages({
    "any.required": i18n.t("errorMessages.bookFileIsRequired"),
  }),
});

export const createBookSchema = Joi.object({
  bookVersion: bookVersionSchema.required(),

  // Conditionally require book info based on bookVersion.bookId
  title: Joi.string()
    .max(100)
    .trim()
    .allow(null)
    .messages({
      "string.base": i18n.t("errorMessages.bookTitleMustBeString"),
      "string.max": i18n.t("errorMessages.bookTitleIsTooLong"),
    }),
  authorId: Joi.number()
    .integer()
    .allow(null)
    .messages({
      "number.base": i18n.t("errorMessages.authorIdMustBeNumber"),
    }),
  category: Joi.string()
    .valid(...allowedCategoryCodes)
    .required()
    .messages({
      "any.only": i18n.t("errorMessages.invalidCategoryCode"),
      "any.required": i18n.t("errorMessages.categoryIsRequired"),
      "string.base": i18n.t("errorMessages.categoryMustBeString"),
    }),
  description: Joi.string()
    .allow(null)
    .min(30)
    .max(700)
    .trim()
    .messages({
      "string.base": i18n.t("errorMessages.bookDescriptionMustBeString"),
      "string.min": i18n.t("errorMessages.bookDescriptionTooShort"),
      "string.max": i18n.t("errorMessages.bookDescriptionTooLong"),
    }),
  thumbnail: Joi.allow(null).messages({
    "any.required": i18n.t("errorMessages.thumbnailIsRequired"),
  }),

  // Conditionally require author info based on authorId
  author: createAuthorSchema.allow(null).messages({
    "any.required": i18n.t("errorMessages.authorIsRequired"),
  }),
})
  .custom((value, helpers) => {
    const hasBookId = !!value.bookVersion?.bookId;

    const hasBookInfo =
      value.title && value.category && value.description && value.thumbnail;

    if (!hasBookId && !hasBookInfo) {
      return helpers.error("bookInfo.required", {
        message: i18n.t("errorMessages.bookInfoRequired"),
      });
    }

    if (hasBookId && hasBookInfo) {
      return helpers.error("bookInfo.required", {
        message: i18n.t("errorMessages.eitherBookIdOrBook"),
      });
    }

    if (!value.authorId && !value.author && !hasBookId) {
      return helpers.error("authorInfo.required", {
        message: i18n.t("errorMessages.authorIsRequired"),
      });
    }

    if (value.authorId && value.author) {
      return helpers.error("authorInfo.required", {
        message: i18n.t("errorMessages.eitherAuthorIdOrAuthor"),
      });
    }

    return value;
  })
  .messages({
    "bookInfo.required": "{{#message}}", // allows custom helper errors to pass through
    "authorInfo.required": "{{#message}}",
  });

//Get AllBooksPaging Schema =============================================================

export type GetAllBooksPaging = {
  search: string;
  country: string;
  sortBy: string;
  page_index: number;
  category: string;
};

const allowedSortFields = [
  "popularity DESC",
  "createdAt DESC",
  "createdAt ASC",
];

export const getAllBooksPagingSchema: ObjectSchema<GetAllBooksPaging> =
  Joi.object({
    search: Joi.string()
      .allow("")
      .optional()
      .messages({
        "string.base": i18n.t("errorMessages.bookSearchMustBeString"),
      }),
    country: Joi.string()
      .valid(...allowedCountries)
      .allow("All")
      .default("All"),
    sortBy: Joi.string()
      .valid(...allowedSortFields)
      .default("createdAt DESC")
      .messages({
        "any.only": i18n.t("errorMessages.invalidSortBy"),
        "string.base": i18n.t("errorMessages.sortByMustBeString"),
      }),
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

//Get books by title and author's name
export type GetBooksByTitleAndAuthor = {
  search: string;
};

export const getBooksByTitleAndAuthorSchema: ObjectSchema<GetBooksByTitleAndAuthor> =
  Joi.object({
    search: Joi.string()
      .allow("")
      .trim()
      .messages({
        "string.base": i18n.t("errorMessages.bookSearchMustBeString"),
      }),
  });

//Get Book versions by book ID
export type GetBookVersionsById = {
  bookId: number;
  sortBy: string;
  page_index: number;
};

export const getBookVersionsByIdSchema: ObjectSchema<GetBookVersionsById> =
  Joi.object({
    bookId: Joi.number()
      .integer()
      .required()
      .messages({
        "any.required": i18n.t("errorMessages.bookIdIsRequired"),
        "number.base": i18n.t("errorMessages.bookIdMustBeNumber"),
      }),
    sortBy: Joi.string()
      .valid(...allowedSortFields)
      .default("createdAt DESC")
      .messages({
        "any.only": i18n.t("errorMessages.invalidSortBy"),
        "string.base": i18n.t("errorMessages.sortByMustBeString"),
      }),
    page_index: Joi.number().integer().min(1).default(1),
  });

//views update

export type UpdateViewsParams = {
  bookId: number;
  bookVersionId: number;
  contributorId: number;
};

export const updateBooksViewsSchema: ObjectSchema<UpdateViewsParams> =
  Joi.object({
    bookId: Joi.number()
      .integer()
      .required()
      .messages({
        "any.required": i18n.t("errorMessages.bookIdIsRequired"),
        "number.base": i18n.t("errorMessages.bookIdMustBeNumber"),
      }),
    bookVersionId: Joi.number()
      .integer()
      .required()
      .messages({
        "any.required": i18n.t("errorMessages.bookVersionIdIsRequired"),
        "number.base": i18n.t("errorMessages.bookVersionIdMustBeNumber"),
      }),
    contributorId: Joi.number()
      .integer()
      .required()
      .messages({
        "any.required": i18n.t("errorMessages.contributorIdIsRequired"),
        "number.base": i18n.t("errorMessages.contributorIdMustBeNumber"),
      }),
  });

//For GenAI Services
export type AITranslateParams = {
  content: string;
  language: string;
  title: string;
  service: string;
};

const allowedAiServices = ["translate", "discuss", "summarize"];

export const AIContentSchema: ObjectSchema<AITranslateParams> = Joi.object({
  content: Joi.string()
    .max(480)
    .required()
    .custom((value) => {
      return value.trim().replace(/^\.+|\.+$/g, ""); // remove leading/trailing dots
    }, "Custom trim")
    .messages({
      "any.required": i18n.t("errorMessages.contentRequiredForAI"),
      "string.base": i18n.t("errorMessages.contentForAIMustBeString"),
      "string.max": i18n.t("errorMessages.contentForAIIsTooLong"),
    }),
  language: Joi.string()
    .trim()
    .required()
    .messages({
      "any.required": i18n.t("errorMessages.languageRequiredForAI"),
      "string.base": i18n.t("errorMessages.languageForAIMustBeString"),
    }),
  title: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
      "string.base": i18n.t("errorMessages.bookTitleMustBeString"),
      "string.max": i18n.t("errorMessages.bookTitleIsTooLong"),
      "any.required": i18n.t("errorMessages.bookTitleRequiredForAI"),
    }),
  service: Joi.string()
    .trim()
    .valid(...allowedAiServices)
    .required()
    .messages({
      "any.only": i18n.t("errorMessages.invalidAIServiceName"),
      "any.required": i18n.t("errorMessages.AIServiceNameIsRequired"),
      "string.base": i18n.t("errorMessages.AIServiceNameMustBeString"),
    }),
});

//getBooksPagingByAuthorsID

export type GetBooksPagingByAuthorID = {
  search: string;
  sortBy: string;
  page_index: number;
  category: string;
  authorId: number;
};

export const getBooksPagingByAuthorIdSchema: ObjectSchema<GetBooksPagingByAuthorID> =
  Joi.object({
    search: Joi.string()
      .allow("")
      .optional()
      .messages({
        "string.base": i18n.t("errorMessages.bookSearchMustBeString"),
      }),
    sortBy: Joi.string()
      .valid(...allowedSortFields)
      .default("createdAt DESC")
      .messages({
        "any.only": i18n.t("errorMessages.invalidSortBy"),
        "string.base": i18n.t("errorMessages.sortByMustBeString"),
      }),
    category: Joi.string()
      .valid(...allowedCategoryCodes)
      .allow("All")
      .default("All")
      .messages({
        "any.only": i18n.t("errorMessages.invalidCategoryCode"),
        "string.base": i18n.t("errorMessages.categoryMustBeString"),
      }),
    page_index: Joi.number().integer().min(1).default(1),
    authorId: Joi.number()
      .integer()
      .required()
      .messages({
        "any.required": i18n.t("errorMessages.authorIdIsRequired"),
        "number.base": i18n.t("errorMessages.authorIdMustBeNumber"),
      }),
  });
