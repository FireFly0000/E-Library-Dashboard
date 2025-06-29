import { RequestHasLogin } from "../types/request.type";
import { uploadBookFile } from "../configs/multer.config";
import { Response, NextFunction } from "express";
import { MulterError } from "multer";

export const uploadBookFileMdw = async (
  req: RequestHasLogin,
  res: Response,
  next: NextFunction
) => {
  uploadBookFile(req, res, (error: any) => {
    if (error instanceof MulterError) {
      res
        .status(400)
        .json({ message: error.message, success: false, status_code: 400 });
      return;
    }
    next();
  });
};
