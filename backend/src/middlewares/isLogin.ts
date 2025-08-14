import { RequestHasLogin } from "../types/request.type";
import { Response, NextFunction } from "express";
import jwt, {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from "jsonwebtoken";
import { MyJwtPayload } from "../types/decodeToken.type";
import { db } from "../configs/db.config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import configs from "../configs/index";
import i18n from "../utils/i18next";

export const isLogin = async (
  req: RequestHasLogin,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        message: i18n.t("errorMessages.unauthorized"),
        success: false,
      });
      return;
    } else {
      const decoded = jwt.verify(
        token,
        configs.general.JWT_SECRET_KEY
      ) as MyJwtPayload;
      if (decoded) {
        const requestUser = await db.user.findUnique({
          where: {
            id: decoded.user_id,
          },
        });
        if (requestUser) {
          req.user_id = requestUser.id;
        }
      }
    }
    next();
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      res.status(401).json({ message: error.toString() });
      return;
    }
    if (error instanceof TokenExpiredError) {
      res.status(401).json({ message: error.message });
      return;
    } else if (error instanceof JsonWebTokenError) {
      res.status(401).json({ message: error.message });
      return;
    } else if (error instanceof NotBeforeError) {
      res.status(401).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: i18n.t("errorMessages.internalServer") });
    return;
  }
};
