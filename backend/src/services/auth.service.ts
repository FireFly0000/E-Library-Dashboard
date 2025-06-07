import { Request } from "express";
import {
  ResponseBase,
  ResponseError,
  ResponseSuccess,
} from "../commons/response";
import { db } from "../configs/db.config";
import i18n from "../utils/i18next";
import jwt, {
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError,
} from "jsonwebtoken";
import bcrypt from "bcrypt";
import configs from "../configs/index";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { MyJwtPayload } from "../types/decodeToken.type";
import { sendVerificationEmail } from "../utils/helper";

const register = async (req: Request): Promise<ResponseBase> => {
  try {
    const { email, password, username } = req.body;

    const userFoundByEmail = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userFoundByEmail) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.emailAlreadyExists"),
        false
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      password,
      configs.general.HASH_SALT
    );

    // Create a new user in the database
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    // If the user is created successfully, send a verification email
    if (newUser) {
      const payload = {
        email: newUser.email,
        id: newUser.id,
      };

      const isSendEmailSuccess = sendVerificationEmail(payload);
      if (isSendEmailSuccess) {
        return new ResponseSuccess(
          200,
          i18n.t("successMessages.signUpSuccess"),
          true
        );
      }
      return new ResponseError(
        400,
        i18n.t("errorMessages.errorSendEmail"),
        false
      );
    }

    // If user creation fails, return an error
    return new ResponseError(400, i18n.t("errorMessages.signUpFailed"), false);
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      return new ResponseError(400, error.toString(), false);
    }
    console.error("Error in register service:", error);
    return new ResponseError(
      500,
      i18n.t("errorMessages.internalServer"),
      false
    );
  }
};

const verifyEmail = async (req: Request): Promise<ResponseBase> => {
  try {
    const { token } = req.params;

    const isVerifyToken = jwt.verify(
      token,
      configs.general.JWT_SECRET_KEY
    ) as MyJwtPayload;

    if (isVerifyToken) {
      const isUserFound = await db.user.findUnique({
        where: {
          email: isVerifyToken.email,
        },
      });

      //Email already verified
      if (isUserFound?.is_verify === true) {
        return new ResponseSuccess(
          200,
          i18n.t("successMessages.verifiedEmailBefore"),
          true
        );
      }

      // Update the user's is_verify status to true
      const isVerifyUser = await db.user.update({
        where: {
          email: isUserFound?.email,
        },
        data: {
          is_verify: true,
        },
      });

      if (isVerifyUser) {
        return new ResponseSuccess(
          200,
          i18n.t("successMessages.verifiedEmail"),
          true
        );
      }
    }

    return new ResponseError(
      400,
      i18n.t("errorMessages.verifiedEmailFailed"),
      true
    );
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      return new ResponseError(400, error.toString(), false);
    }
    if (error instanceof TokenExpiredError) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.emailTokenExpired"),
        false
      );
    } else if (error instanceof JsonWebTokenError) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.tokenVerifiedCode"),
        false
      );
    } else if (error instanceof NotBeforeError) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.tokenGenerateCode"),
        false
      );
    }

    return new ResponseError(
      500,
      i18n.t("errorMessages.internalServer"),
      false
    );
  }
};

const resendVerificationEmail = async (req: Request): Promise<ResponseBase> => {
  try {
    const { token } = req.params;
    const payload = jwt.decode(token) as MyJwtPayload | null;
    const isSendEmailSuccess = sendVerificationEmail(payload);

    if (isSendEmailSuccess) {
      return new ResponseSuccess(
        200,
        i18n.t("successMessages.resendVerificationEmail"),
        true
      );
    }
    return new ResponseError(
      400,
      i18n.t("errorMessages.errorSendEmail"),
      false
    );
  } catch (error: any) {
    return new ResponseError(
      500,
      i18n.t("errorMessages.internalServer"),
      false
    );
  }
};

const AuthService = {
  register,
  verifyEmail,
  resendVerificationEmail,
};

export default AuthService;
