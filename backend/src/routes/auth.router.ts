import { Router } from "express";
import controllers from "../controllers/index";

const authRouter: Router = Router();

authRouter.post("/register", (req, res) => {
  controllers.authController.register(req, res);
});
authRouter.patch("/verify/:token", (req, res) => {
  controllers.authController.verifyEmail(req, res);
});
authRouter.get("/resend-verification/:token", (req, res) => {
  controllers.authController.resendVerificationEmail(req, res);
});

export default authRouter;
