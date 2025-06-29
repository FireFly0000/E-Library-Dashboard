import { Router } from "express";
import controllers from "../controllers/index";
import { uploadBookFileMdw } from "middlewares/multer";
import { isLogin } from "middlewares/isLogin";
//import multer from "multer";
//const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });

const bookRouter: Router = Router();

bookRouter.post("/", isLogin, uploadBookFileMdw, (req, res) => {
  controllers.bookController.createAuthor(req, res);
});
//bookRouter.get("/", getAllBooks);
//bookRouter.get("/paging", getAllBooksPaging);
//bookRouter.get("/:id", getBookById);
//bookRouter.put("/:id", updateBook);
//bookRouter.delete("/:id", deleteBook);

export default bookRouter;
