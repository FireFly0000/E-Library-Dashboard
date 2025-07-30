import { Router } from "express";
import controllers from "../controllers/index";

const userRouter: Router = Router();

userRouter.get("/profile", (req, res) => {
  controllers.userController.getUserProfile(req, res);
});

export default userRouter;
