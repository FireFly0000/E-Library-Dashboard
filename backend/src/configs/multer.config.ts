import multer from "multer";

const storage = multer.memoryStorage();

//Files size limits are validated in controller layer
export const uploadBookAssets = multer({
  storage,
  fileFilter(req, file, cb) {
    const allowedBookTypes = ["application/pdf", "application/epub+zip"];
    const allowedImgTypes = ["image/png", "image/jpg", "image/jpeg"];

    if (file.fieldname === "bookFile") {
      if (!allowedBookTypes.includes(file.mimetype)) {
        return cb(new Error("Invalid book file, must be PDF or EPUB"));
      }
    }

    if (file.fieldname === "thumbnail") {
      if (!allowedImgTypes.includes(file.mimetype)) {
        return cb(new Error("Invalid thumbnail, must be PNG, JPG, or JPEG"));
      }
    }

    // If other fields come in, you can reject them too
    if (!["bookFile", "thumbnail"].includes(file.fieldname)) {
      return cb(new Error(`Unexpected field: ${file.fieldname}`));
    }

    cb(null, true);
  },
}).fields([
  { name: "bookFile", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);
