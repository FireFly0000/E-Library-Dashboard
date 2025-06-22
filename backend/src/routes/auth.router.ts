import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const authRouter: Router = Router();

authRouter.post("/register", (req, res) => {
  controllers.authController.register(req, res);
});
authRouter.get("/verify/:token", (req, res) => {
  controllers.authController.verifyEmail(req, res);
});
authRouter.get("/resend-verification/:token", (req, res) => {
  controllers.authController.resendVerificationEmail(req, res);
});
authRouter.post("/login", (req, res) => {
  controllers.authController.login(req, res);
});
authRouter.get("/refresh", (req, res) => {
  controllers.authController.refreshToken(req, res);
});
authRouter.get("/me", isLogin, (req, res) => {
  controllers.authController.getMe(req, res);
});

export default authRouter;
