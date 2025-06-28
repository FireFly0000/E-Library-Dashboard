import {
  ResponseBase,
  ResponseError,
  ResponseSuccess,
  ResponseSuccessPaginated,
} from "../commons/response";
import { db } from "../configs/db.config";
import i18n from "../utils/i18next";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { RequestHasLogin } from "../types/request.type";

const createBook = async (
  req: RequestHasLogin,
  params
): Promise<ResponseBase> => {
  try {
    if (!req.user_id) {
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return new ResponseError(400, error.toString(), false);
    }

    return new ResponseError(
      500,
      i18n.t("errorMessages.internalServer"),
      false
    );
  }
};

const BookService = {
  createBook,
};

export default BookService;
