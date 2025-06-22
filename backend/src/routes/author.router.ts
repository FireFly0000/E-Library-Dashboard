import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const authorRouter: Router = Router();

authorRouter.get("/paging", isLogin, (req, res) => {
  controllers.authorController.getAllAuthorsPaging(req, res);
});
authorRouter.get("/filter-by-name", isLogin, (req, res) => {
  controllers.authorController.filterAuthorsByName(req, res);
});
authorRouter.post("/create", isLogin, (req, res) => {
  controllers.authorController.createAuthor(req, res);
});
export default authorRouter;
