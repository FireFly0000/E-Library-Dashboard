import {
  ResponseBase,
  ResponseError,
  ResponseSuccess,
  ResponseSuccessPaginated,
} from "../commons/response";
import i18n from "../utils/i18next";
import { RequestHasLogin } from "types/request.type";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { workers } from "../utils/worker";

const dailyCleanUp = async (req: RequestHasLogin): Promise<ResponseBase> => {
  try {
    await workers.dailyCleanupTrash();
    return new ResponseSuccess(
      200,
      i18n.t("successMessages.dailyCleanUpSuccess"),
      true
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return new ResponseError(405, error.toString(), false);
    }
    return new ResponseError(
      500,
      i18n.t("errorMessages.internalServer"),
      false
    );
  }
};

const SystemService = { dailyCleanUp };

export default SystemService;
