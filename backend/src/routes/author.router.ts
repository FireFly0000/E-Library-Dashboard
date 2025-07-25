import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const authorRouter: Router = Router();

authorRouter.get("/paging", (req, res) => {
  controllers.authorController.getAllAuthorsPaging(req, res);
});
authorRouter.get("/search-by-name", isLogin, (req, res) => {
  controllers.authorController.searchAuthorsByName(req, res);
});
authorRouter.post("/create", isLogin, (req, res) => {
  controllers.authorController.createAuthor(req, res);
});
export default authorRouter;
