import { Router } from "express";
import controllers from "../controllers/index";
import {
  uploadBookAssetsMdw,
  enforceUploadLimits,
} from "../middlewares/multer";
import { isLogin } from "../middlewares/isLogin";
import { viewerIdentifier } from "../middlewares/viewerIdentifier";
//import multer from "multer";
//const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });

const bookRouter: Router = Router();

bookRouter.post(
  "/",
  isLogin,
  uploadBookAssetsMdw,
  enforceUploadLimits,
  (req, res) => {
    controllers.bookController.createBook(req, res);
  }
);
bookRouter.get("/paging", (req, res) => {
  controllers.bookController.getAllBooksPaging(req, res);
});
bookRouter.get("/title-by-author", isLogin, (req, res) => {
  controllers.bookController.getBooksByTitleAndAuthor(req, res);
});
bookRouter.get("/book-versions", (req, res) => {
  controllers.bookController.getBookVersions(req, res);
});
bookRouter.post("/update-view-count", viewerIdentifier, (req, res) => {
  controllers.bookController.updateBooksViews(req, res);
});
bookRouter.get("/ai-services", (req, res) => {
  controllers.bookController.AIContentServices(req, res);
});
bookRouter.get("/books-by-author-id", (req, res) => {
  controllers.bookController.getBooksPagingByAuthorID(req, res);
});
//bookRouter.put("/:id", updateBook);
//bookRouter.delete("/:id", deleteBook);

export default bookRouter;
