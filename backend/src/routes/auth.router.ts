import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { auth } from "google-auth-library";

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
authRouter.get("/logout", isLogin, (req, res) => {
  controllers.authController.logout(req, res);
});
authRouter.get("/sessions", isLogin, (req, res) => {
  controllers.authController.getUserSessions(req, res);
});
authRouter.get("/logout-session", isLogin, (req, res) => {
  controllers.authController.logoutSession(req, res);
});
authRouter.post("/update-email", isLogin, (req, res) => {
  controllers.authController.updateEmail(req, res);
});
authRouter.post("/update-password", isLogin, (req, res) => {
  controllers.authController.updatePassword(req, res);
});

export default authRouter;
