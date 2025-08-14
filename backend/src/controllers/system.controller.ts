import { Request, Response } from "express";
import { convertJoiErrorToString } from "../commons/index";
import services from "../services/index";

class SystemController {
  dailyTrashCleanUp = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const response = await services.SystemService.dailyCleanUp(req);
    return res.status(response.getStatusCode()).json(response);
  };
}

export default SystemController;
