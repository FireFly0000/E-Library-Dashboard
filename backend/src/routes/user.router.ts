import { Router } from "express";
import controllers from "../controllers/index";
import {
  updateUserProfileImgFileMdw,
  enforceUploadLimits,
} from "../middlewares/multer";
import { isLogin } from "../middlewares/isLogin";

const userRouter: Router = Router();

userRouter.get("/profile", (req, res) => {
  controllers.userController.getUserProfile(req, res);
});
userRouter.post(
  "/update-profile-img",
  isLogin,
  updateUserProfileImgFileMdw,
  enforceUploadLimits,
  (req, res) => {
    controllers.userController.updateUserProfileImg(req, res);
  }
);

export default userRouter;
