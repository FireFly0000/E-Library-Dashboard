import Joi, { ObjectSchema } from "joi";
import i18n from "../utils/i18next";

//getUserProfile
export type GetUserProfileParams = {
  search: string;
  sortBy: string;
  page_index: number;
  userId: number;
};

const allowedSortFields = [
  "popularity DESC",
  "createdAt DESC",
  "createdAt ASC",
];

export const getUserProfileSchema: ObjectSchema<GetUserProfileParams> =
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
    page_index: Joi.number().integer().min(1).default(1),
    userId: Joi.number()
      .integer()
      .required()
      .messages({
        "any.required": i18n.t("errorMessages.contributorIdIsRequired"),
        "number.base": i18n.t("errorMessages.contributorIdMustBeNumber"),
      }),
  });

//updateUserProfileImg

export type UpdateUserProfileImgParams = {
  profileImg: Express.Multer.File;
  profileId: number;
};

export const updateUserProfileImgSchema: ObjectSchema<UpdateUserProfileImgParams> =
  Joi.object({
    profileImg: Joi.required().messages({
      "any.required": i18n.t("errorMessages.profileImgFileRequired"),
    }),
    profileId: Joi.number()
      .integer()
      .required()
      .messages({
        "any.required": i18n.t("errorMessages.profileIdIsRequired"),
        "number.base": i18n.t("errorMessages.profileIdMustBeNumber"),
      }),
  });
