import { RequestHasLogin } from "../types/request.type";
import { uploadBookAssets } from "../configs/multer.config";
import { Response, NextFunction } from "express";
import { MulterError } from "multer";

export const uploadBookAssetsMdw = async (
  req: RequestHasLogin,
  res: Response,
  next: NextFunction
) => {
  uploadBookAssets(req, res, (error: any) => {
    if (error) {
      return res
        .status(400)
        .json({ message: error.message, success: false, status_code: 400 });
    }
    next();
  });
};

export const enforceUploadLimits = (req, res, next) => {
  const bookFile = req.files?.bookFile?.[0];
  const thumbnailFile = req.files?.thumbnail?.[0];

  if (bookFile && bookFile.size > 20 * 1024 * 1024) {
    return res.status(400).json({ message: "Book file exceeds 20MB limit" });
  }

  if (thumbnailFile && thumbnailFile.size > 4 * 1024 * 1024) {
    return res.status(400).json({ message: "Thumbnail exceeds 4MB limit" });
  }

  next();
};
