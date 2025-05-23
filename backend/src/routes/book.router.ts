import { Router } from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  getAllBooksPaging,
} from "../controllers/book.controller";
import multer from "multer";

const bookRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

bookRouter.get("/", getAllBooks);
bookRouter.get("/paging", getAllBooksPaging);
bookRouter.get("/:id", getBookById);
bookRouter.post("/", upload.single("file"), createBook);
//bookRouter.put("/:id", updateBook);
//bookRouter.delete("/:id", deleteBook);

export default bookRouter;
