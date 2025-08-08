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

//deleteBookVersion
export type MoveBookVersionToTrashParams = {
  bookVersionId: number;
  profileId: number;
};

export const moveBookVersionToTrashSchema: ObjectSchema<MoveBookVersionToTrashParams> =
  Joi.object({
    bookVersionId: Joi.number()
      .integer()
      .required()
      .messages({
        "any.required": i18n.t("errorMessages.bookVersionIdIsRequired"),
        "number.base": i18n.t("errorMessages.bookVersionIdMustBeNumber"),
      }),
    profileId: Joi.number()
      .integer()
      .required()
      .messages({
        "any.required": i18n.t("errorMessages.profileIdIsRequired"),
        "number.base": i18n.t("errorMessages.profileIdMustBeNumber"),
      }),
  });

//updateUserBasicInfo (username, gender, birth year etc)
export type UpdateUserBasicInfoParams = {
  username: string;
};

export const updateUserBasicInfoSchema: ObjectSchema<UpdateUserBasicInfoParams> =
  Joi.object({
    username: Joi.string()
      .trim()
      .max(51)
      .required()
      .messages({
        "string.base": i18n.t("errorMessages.UsernameMustBeString"),
        "string.max": i18n.t("errorMessages.tooLongUsername"),
        "any.required": i18n.t("errorMessages.UsernameIsRequired"),
      }),
  });

//recoverTrashedBookVersion
export type RecoverTrashedBookVersionParams = {
  bookVersionId: number;
};

export const recoverTrashedBookVersionSchema: ObjectSchema<RecoverTrashedBookVersionParams> =
  Joi.object({
    bookVersionId: Joi.number()
      .integer()
      .required()
      .messages({
        "any.required": i18n.t("errorMessages.bookVersionIdIsRequired"),
        "number.base": i18n.t("errorMessages.bookVersionIdMustBeNumber"),
      }),
  });

//deleteBookVersion
export type DeleteBookVersionParams = {
  bookVersionId: number;
};

export const deleteBookVersionSchema: ObjectSchema<DeleteBookVersionParams> =
  Joi.object({
    bookVersionId: Joi.number()
      .integer()
      .required()
      .messages({
        "any.required": i18n.t("errorMessages.bookVersionIdIsRequired"),
        "number.base": i18n.t("errorMessages.bookVersionIdMustBeNumber"),
      }),
  });
