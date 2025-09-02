import e, { Request } from "express";
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
import {
  getFileUrlFromS3,
  hashedToken,
  sendVerificationEmail,
} from "../utils/helper";
import { JwtPayload } from "jsonwebtoken";
import { RequestHasLogin } from "../types/request.type";
import redis from "../configs/redis.config";
import { v4 as uuidv4 } from "uuid";
import ms from "ms";

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

      //storing sessionId for multi devices management
      const sessionId = uuidv4();
      const userAgent = req.headers["user-agent"] || "unknown";
      const ipAddress =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
      const refreshTokenHash = hashedToken(refreshToken);

      await redis.hset(`session_${sessionId}`, {
        userId: userFound.id,
        refreshTokenHash,
        userAgent,
        ipAddress,
        createdAt: Date.now(),
        lastUsedAt: Date.now(),
        expireAt: Date.now() + ms(configs.general.TOKEN_REFRESH_EXPIRED_TIME),
      });
      // set TTL so session auto-expires
      await redis.expire(
        `session_${sessionId}`,
        Math.floor(ms(configs.general.TOKEN_REFRESH_EXPIRED_TIME) / 1000)
      );
      await redis.sadd(`user_sessions_${userFound.id}`, sessionId);

      //Return the access token and refresh token.
      return new ResponseWithToken(
        200,
        i18n.t("successMessages.successLogin"),
        true,
        { accessToken, refreshToken, sessionId }
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
    let oldToken = req.cookies.refreshToken;
    console.log("Old Token:", oldToken);
    const sessionId = req.cookies.sessionId;
    if (!oldToken) {
      const rfrHeader = req.headers.rfrTk;

      if (typeof rfrHeader === "string") {
        oldToken = rfrHeader.split(":")[1];
      } else if (Array.isArray(rfrHeader)) {
        oldToken = rfrHeader[0].split(":")[1];
      }
      console.log("Old Token from header:", oldToken);
    }

    if (!oldToken) {
      console.log("No token found");
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }

    //Check if refresh token is blacklisted
    const hashedOldToken = hashedToken(oldToken);
    const isBlacklisted = await redis.get(`bl_${hashedOldToken}`);
    if (isBlacklisted) {
      console.log("Token is blacklisted");
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }

    //validate against session info as well
    console.log("Session ID:", sessionId);
    console.log("cookies", req.cookies);
    const session = await redis.hgetall(`session_${sessionId}`);
    console.log("Session Data:", session);
    console.log("Session Hashed Token:", session.refreshTokenHash);
    console.log("Hashed Old Token:", hashedOldToken);
    if (!session || session.refreshTokenHash !== hashedOldToken) {
      console.log("Session not found or token hash mismatch");
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }

    const decoded = jwt.verify(
      oldToken,
      configs.general.JWT_SECRET_KEY
    ) as MyJwtPayload;
    if (!decoded) {
      console.log("Token verification failed");
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }

    // Blacklist old token with same expiry time
    const { exp } = jwt.decode(oldToken);
    const ttl = exp - Math.floor(Date.now() / 1000);

    await redis.set(`bl_${hashedOldToken}`, "true", "EX", ttl);

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

    //reset session with new refreshToken
    const newRefreshTokenHash = hashedToken(newRefreshToken);
    await redis.hset(`session_${sessionId}`, {
      refreshTokenHash: newRefreshTokenHash,
      lastUsedAt: Date.now(),
      expireAt: Date.now() + ms(configs.general.TOKEN_REFRESH_EXPIRED_TIME),
    });
    await redis.expire(
      `session_${sessionId}`,
      Math.floor(ms(configs.general.TOKEN_REFRESH_EXPIRED_TIME) / 1000)
    );

    return new ResponseWithToken(
      200,
      i18n.t("successMessages.requestSuccess"),
      true,
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        sessionId: sessionId,
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
    if (!userId) {
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }
    const userFound = await configs.db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (userFound) {
      const userInformation = {
        id: userFound.id,
        email: userFound.email,
        username: userFound.username,
        url_avatar: userFound.url_avatar
          ? await getFileUrlFromS3(userFound.url_avatar)
          : null,
        viewCount: userFound.total_views,
      };
      return new ResponseSuccess(
        200,
        i18n.t("successMessages.requestSuccess"),
        true,
        userInformation
      );
    }

    return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
  } catch (error: any) {
    return new ResponseError(
      500,
      i18n.t("errorMessages.internalServer"),
      false
    );
  }
};

const logout = async (req: RequestHasLogin): Promise<ResponseBase> => {
  try {
    if (!req.user_id) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.unauthorized"),
        false
      );
    }

    const sessionId = req.cookies.sessionId;
    let token = req.cookies.refreshToken;
    if (!token) {
      const rfrHeader = req.headers.rfrtk;

      if (typeof rfrHeader === "string") {
        token = rfrHeader.split(":")[1];
      } else if (Array.isArray(rfrHeader)) {
        token = rfrHeader[0].split(":")[1];
      }
    }

    //Blacklisting current refreshToken and delete session
    if (token) {
      try {
        const hashedOldToken = hashedToken(token);
        const { exp } = jwt.decode(token);
        const ttl = exp - Math.floor(Date.now() / 1000);
        await redis.set(`bl_${hashedOldToken}`, "true", "EX", ttl);

        //delete session
        await redis.del(`session_${sessionId}`);
        await redis.srem(`user_sessions_${req.user_id}`, String(sessionId));
      } catch (error) {
        return new ResponseError(
          400,
          i18n.t("errorMessages.blacklistFailed"),
          false
        );
      }
    } else {
      return new ResponseError(
        400,
        i18n.t("errorMessages.cantFindToken"),
        false
      );
    }

    return new ResponseSuccess(
      200,
      i18n.t("successMessages.logoutSuccess"),
      true
    );
  } catch (error) {
    return new ResponseError(
      500,
      i18n.t("errorMessages.internalServer"),
      false
    );
  }
};

const getUserSessions = async (req: RequestHasLogin): Promise<ResponseBase> => {
  try {
    if (!req.user_id) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.unauthorized"),
        false
      );
    }

    const sessionIds = await redis.smembers(`user_sessions_${req.user_id}`);
    const sessionInfo = await Promise.all(
      sessionIds.map(async (id) => {
        const userAgent = await redis.hmget(`session_${id}`, "userAgent");
        return {
          sessionId: id,
          userAgent: userAgent[0],
        };
      })
    );

    return new ResponseSuccess(
      200,
      i18n.t("successMessages.getUserSessionsSuccess"),
      true,
      sessionInfo
    );
  } catch (error) {
    return new ResponseError(
      500,
      i18n.t("errorMessages.internalServer"),
      false
    );
  }
};

const logoutSession = async (req: RequestHasLogin): Promise<ResponseBase> => {
  try {
    const sessionId = req.query.sessionId;
    if (!req.user_id) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.unauthorized"),
        false
      );
    }

    const hashedSessionToken = await redis.hget(
      `session_${sessionId}`,
      "refreshTokenHash"
    );
    const expireAt = await redis.hget(`session_${sessionId}`, "expireAt");

    //Blacklisting current refreshToken and delete session
    if (hashedSessionToken) {
      try {
        const ttl = Math.floor((Number(expireAt) - Date.now()) / 1000);
        await redis.set(`bl_${hashedSessionToken}`, "true", "EX", ttl);

        //delete session
        await redis.del(`session_${sessionId}`);
        await redis.srem(`user_sessions_${req.user_id}`, String(sessionId));
      } catch (error) {
        return new ResponseError(
          400,
          i18n.t("errorMessages.blacklistFailed"),
          false
        );
      }
    } else {
      return new ResponseError(
        400,
        i18n.t("errorMessages.cantFindToken"),
        false
      );
    }

    return new ResponseSuccess(
      200,
      i18n.t("successMessages.logoutSuccess"),
      true
    );
  } catch (error) {
    return new ResponseError(
      500,
      i18n.t("errorMessages.internalServer"),
      false
    );
  }
};

const updateEmail = async (
  req: RequestHasLogin,
  params: { newEmail: string; password: string }
): Promise<ResponseBase> => {
  try {
    const userId = req.user_id;
    const newEmail = params.newEmail;
    const password = params.password;
    if (!userId) {
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }

    //perform in transaction
    const updatedEmail = await db.$transaction(async (tx) => {
      const userFound = await tx.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!userFound) {
        throw new Error("User not found");
      }

      const correctPassword = await bcrypt.compare(
        password,
        userFound.password
      );
      if (!correctPassword) {
        throw new Error("Wrong password");
      }

      const emailExists = await tx.user.findUnique({
        where: {
          email: newEmail,
        },
      });

      if (emailExists) {
        throw new Error("Email already in use");
      }

      const updatedUser = await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          email: newEmail,
          is_verify: false,
        },
      });

      return updatedUser;
    });

    if (!updatedEmail) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.updatedEmailFailed"),
        false
      );
    }

    //logout user from all sessions
    const sessionIds = await redis.smembers(`user_sessions_${userId}`);
    await Promise.all(
      sessionIds.map(async (id) => {
        const hashedSessionToken = await redis.hget(
          `session_${id}`,
          "refreshTokenHash"
        );
        const expireAt = await redis.hget(`session_${id}`, "expireAt");
        if (hashedSessionToken) {
          const ttl = Math.floor((Number(expireAt) - Date.now()) / 1000);
          await redis.set(`bl_${hashedSessionToken}`, "true", "EX", ttl);
        }
        await redis.del(`session_${id}`);
        await redis.srem(`user_sessions_${userId}`, String(id));
      })
    );

    //send verification email
    const payload = {
      email: newEmail,
      id: req.user_id,
    };

    const isSendEmailSuccess = sendVerificationEmail(payload);
    if (!isSendEmailSuccess) {
      return new ResponseError(
        400,
        i18n.t("successMessages.updatedEmailButErrorSendEmail"),
        true
      );
    }

    return new ResponseSuccess(
      200,
      i18n.t("successMessages.updatedEmailSuccess"),
      true
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return new ResponseError(400, error.toString(), false);
    }

    if (error.message === "User not found") {
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }

    if (error.message === "Wrong password") {
      return new ResponseError(
        400,
        i18n.t("errorMessages.wrongPassword"),
        false
      );
    }

    if (error.message === "Email already in use") {
      return new ResponseError(
        400,
        i18n.t("errorMessages.emailAlreadyExists"),
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

const updatePassword = async (
  req: RequestHasLogin,
  params: { currentPassword: string; newPassword: string }
): Promise<ResponseBase> => {
  try {
    const userId = req.user_id;
    const newPassword = params.newPassword;
    const password = params.currentPassword;

    if (!userId) {
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }

    if (password === newPassword) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.samePassword"),
        false
      );
    }

    const updatedPassword = await db.$transaction(async (tx) => {
      const userFound = await tx.user.findUnique({
        where: {
          id: userId,
        },
      });

      //check current password
      const correctPassword = await bcrypt.compare(
        password,
        userFound.password
      );
      if (!correctPassword) {
        throw new Error("Wrong password");
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(
        newPassword,
        configs.general.HASH_SALT
      );

      const updatedUserPassword = await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedNewPassword,
        },
      });

      return updatedUserPassword;
    });

    if (!updatedPassword) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.updatedPasswordFailed"),
        false
      );
    }

    //logout user from all sessions
    const sessionIds = await redis.smembers(`user_sessions_${userId}`);
    await Promise.all(
      sessionIds.map(async (id) => {
        const hashedSessionToken = await redis.hget(
          `session_${id}`,
          "refreshTokenHash"
        );
        const expireAt = await redis.hget(`session_${id}`, "expireAt");
        if (hashedSessionToken) {
          const ttl = Math.floor((Number(expireAt) - Date.now()) / 1000);
          await redis.set(`bl_${hashedSessionToken}`, "true", "EX", ttl);
        }
        await redis.del(`session_${id}`);
        await redis.srem(`user_sessions_${userId}`, String(id));
      })
    );

    return new ResponseSuccess(
      200,
      i18n.t("successMessages.updatedPasswordSuccess"),
      true
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return new ResponseError(400, error.toString(), false);
    }
    if (error.message === "Wrong password") {
      return new ResponseError(
        400,
        i18n.t("errorMessages.wrongPassword"),
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

const AuthService = {
  register,
  verifyEmail,
  resendVerificationEmail,
  login,
  refreshToken,
  getMe,
  logout,
  getUserSessions,
  logoutSession,
  updateEmail,
  updatePassword,
};

export default AuthService;
