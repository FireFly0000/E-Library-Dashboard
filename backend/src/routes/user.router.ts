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
userRouter.get("/move-book-version-to-trash", isLogin, (req, res) => {
  controllers.userController.moveBookVersionToTrash(req, res);
});
userRouter.put("/update-user-basic-info", isLogin, (req, res) => {
  controllers.userController.updateUserBasicInfo(req, res);
});
userRouter.get("/get-book-versions-in-trash", isLogin, (req, res) => {
  controllers.userController.getBookVersionsInTrash(req, res);
});
userRouter.get("/recover-trashed-book-version", isLogin, (req, res) => {
  controllers.userController.recoverTrashedBookVersion(req, res);
});
userRouter.delete(
  "/delete-book-version/:bookVersionId",
  isLogin,
  (req, res) => {
    controllers.userController.deleteBookVersion(req, res);
  }
);
export default userRouter;
