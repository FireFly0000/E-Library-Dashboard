import { Router } from "express";
import controllers from "../controllers/index";
import { isGoogleScheduler } from "../middlewares/isGoogleScheduler";

const systemRouter: Router = Router();

systemRouter.post("/daily-clean-up", isGoogleScheduler, (req, res) => {
  controllers.systemController.dailyTrashCleanUp(req, res);
});

export default systemRouter;
