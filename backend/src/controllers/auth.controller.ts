import { Request, Response } from "express";
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons/index";
import { registrationSchema } from "../validations/auth";
import service from "../services/index";

class AuthController {
  //register or signup controller
  register = async (req: Request, res: Response): Promise<Response> => {
    const errorValidate: ValidationError | undefined =
      registrationSchema.validate(req.body).error;

    if (errorValidate) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(errorValidate),
        success: false,
      });
    }

    const response = await service.AuthService.register(req);

    return res.status(response.getStatusCode()).json(response);
  };

  //verify email controller
  verifyEmail = async (req: Request, res: Response): Promise<Response> => {
    const response = await service.AuthService.verifyEmail(req);

    return res.status(response.getStatusCode()).json(response);
  };

  //resend verification email controller
  resendVerificationEmail = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const response = await service.AuthService.resendVerificationEmail(req);

    return res.status(response.getStatusCode()).json(response);
  };
}

export default AuthController;
