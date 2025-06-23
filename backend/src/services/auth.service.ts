import { Request } from "express";
import {
  ResponseBase,
  ResponseError,
  ResponseSuccess,
  ResponseWithToken,
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
import { JwtPayload } from "jsonwebtoken";
import { RequestHasLogin } from "../types/request.type";

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

    const userFoundByUsername = await db.user.findUnique({
      where: {
        username: username,
      },
    });

    if (userFoundByUsername) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.usernameAlreadyExists"),
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
    return new ResponseError(
      500,
      i18n.t("errorMessages.internalServer"),
      false
    );
  }
};

const login = async (req: Request): Promise<ResponseBase> => {
  try {
    const { email, password } = req.body;

    const userFound = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userFound) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.emailNotFound"),
        false
      );
    }

    const correctPassword = await bcrypt.compare(password, userFound.password);

    if (correctPassword) {
      if (!userFound.is_verify) {
        //if not verified, send verification email
        const payload = {
          email: userFound.email,
          id: userFound.id,
        };
        const isSendEmailSuccess = sendVerificationEmail(payload);
        if (!isSendEmailSuccess) {
          return new ResponseError(
            400,
            i18n.t("errorMessages.errorSendEmail3"),
            false
          );
        }

        return new ResponseError(
          400,
          i18n.t("errorMessages.loginUnverified"),
          false
        );
      }

      // If the user is verified, generate JWT tokens
      const accessToken = jwt.sign(
        { user_id: userFound.id },
        configs.general.JWT_SECRET_KEY,
        {
          expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
        }
      );

      const refreshToken = jwt.sign(
        { user_id: userFound.id },
        configs.general.JWT_SECRET_KEY,
        {
          expiresIn: configs.general.TOKEN_REFRESH_EXPIRED_TIME,
        }
      );
      if (!accessToken || !refreshToken) {
        return new ResponseError(
          400,
          i18n.t("errorMessages.serverFailed"),
          false
        );
      }

      //Return the access token and refresh token.
      //Store the refresh token in Redis
      return new ResponseWithToken(
        200,
        i18n.t("successMessages.successLogin"),
        true,
        { accessToken, refreshToken }
      );
    } else {
      return new ResponseError(
        400,
        i18n.t("errorMessages.wrongPassword"),
        false
      );
    }
  } catch (error: any) {
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
    const payload = jwt.decode(token) as JwtPayload | null;
    const { iat, exp, ...rest } = payload;
    const isSendEmailSuccess = sendVerificationEmail(rest);

    if (isSendEmailSuccess) {
      return new ResponseSuccess(
        200,
        i18n.t("successMessages.resendVerificationEmail"),
        true
      );
    }
    return new ResponseError(
      400,
      i18n.t("errorMessages.errorSendEmail2"),
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

const refreshToken = async (req: Request): Promise<ResponseBase> => {
  try {
    const rfTokenRaw = req.headers.refreshtoken as string;
    const rfToken = rfTokenRaw.split("=")[1];

    if (!rfToken) {
      return new ResponseError(401, i18n.t("errorMessages.badRequest"), false);
    }
    const decoded = jwt.verify(
      rfToken,
      configs.general.JWT_SECRET_KEY
    ) as MyJwtPayload;
    if (!decoded) {
      return new ResponseError(401, i18n.t("errorMessages.badRequest"), false);
    }

    //if current refreshToken is valid, generate new tokens
    const newAccessToken = jwt.sign(
      { user_id: decoded.user_id },
      configs.general.JWT_SECRET_KEY,
      {
        expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
      }
    );

    const newRefreshToken = jwt.sign(
      { user_id: decoded.user_id },
      configs.general.JWT_SECRET_KEY,
      {
        expiresIn: configs.general.TOKEN_REFRESH_EXPIRED_TIME,
      }
    );

    return new ResponseSuccess(
      200,
      i18n.t("successMessages.requestSuccess"),
      true,
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }
    );
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      return new ResponseError(400, i18n.t("errorMessages.loginAgain"), false);
    } else if (error instanceof JsonWebTokenError) {
      return new ResponseError(400, i18n.t("errorMessages.loginAgain"), false);
    } else if (error instanceof NotBeforeError) {
      return new ResponseError(400, i18n.t("errorMessages.loginAgain"), false);
    }

    return new ResponseError(
      500,
      i18n.t("errorMessages.internalServer"),
      false
    );
  }
};

const getMe = async (req: RequestHasLogin): Promise<ResponseBase> => {
  try {
    const userId = req.user_id;
    const userFound = await configs.db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (userFound) {
      const userInformation = {
        user_id: userFound.id,
        email: userFound.email,
        username: userFound.username,
        url_avatar: userFound.url_avatar,
      };
      return new ResponseSuccess(
        200,
        i18n.t("successMessages.requestSuccess"),
        true,
        userInformation
      );
    }

    return new ResponseError(401, i18n.t("errorMessages.UnAuthorized"), false);
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
  login,
  refreshToken,
  getMe,
};

export default AuthService;
