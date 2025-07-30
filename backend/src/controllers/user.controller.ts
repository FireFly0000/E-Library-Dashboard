import { Request, Response } from "express";
import { convertJoiErrorToString } from "../commons/index";
import services from "../services/index";
import { getUserProfileSchema } from "../validations/user";

class UserController {
  getUserProfile = async (req: Request, res: Response): Promise<Response> => {
    const { error, value } = getUserProfileSchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }

    const response = await services.UserService.getUserProfile(value);
    return res.status(response.getStatusCode()).json(response);
  };
}

export default UserController;
