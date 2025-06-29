import { Router } from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  getAllBooksPaging,
} from "../controllers/book.controller";
import { uploadBookFileMdw } from "middlewares/multer";
import { isLogin } from "middlewares/isLogin";
//import multer from "multer";
//const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });

const bookRouter = Router();

bookRouter.get("/", getAllBooks);
bookRouter.get("/paging", getAllBooksPaging);
bookRouter.get("/:id", getBookById);
bookRouter.post("/", isLogin, uploadBookFileMdw, createBook);
//bookRouter.put("/:id", updateBook);
//bookRouter.delete("/:id", deleteBook);

export default bookRouter;
