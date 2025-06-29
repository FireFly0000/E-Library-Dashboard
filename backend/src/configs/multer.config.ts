import multer from "multer";

const storage = multer.memoryStorage();

export const uploadBookFile = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 20, //20MB
  },
  fileFilter(req, file, cb) {
    const allowedTypes = ["application/pdf", "application/epub+zip"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and EPUB files are allowed"));
    }
  },
}).single("file");
