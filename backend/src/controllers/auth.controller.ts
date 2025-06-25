import { Request, Response } from "express";
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons/index";
import { registrationSchema, loginSchema } from "../validations/auth";
import service from "../services/index";
import { ResponseWithToken } from "../commons/response";
import ms from "ms";
import configs from "../configs/index";

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

  //login controller
  login = async (req: Request, res: Response): Promise<Response> => {
    const errorValidate: ValidationError | undefined = loginSchema.validate(
      req.body
    ).error;

    if (errorValidate) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(errorValidate),
        success: false,
      });
    }

    const response = await service.AuthService.login(req);
    if (response instanceof ResponseWithToken) {
      const refreshExpiration = ms(
        configs.general.TOKEN_REFRESH_EXPIRED_TIME || "15d"
      );

      res.cookie("refreshToken", response.getRefreshToken(), {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: refreshExpiration,
      });

      return res.status(response.getStatusCode()).json(response.toJSON());
    }

    return res.status(response.getStatusCode()).json(response);
  };

  //refresh token controller
  async refreshToken(req: Request, res: Response): Promise<Response> {
    const response = await service.AuthService.refreshToken(req);
    if (response instanceof ResponseWithToken) {
      const refreshExpiration = ms(
        configs.general.TOKEN_REFRESH_EXPIRED_TIME || "15d"
      );

      res.cookie("refreshToken", response.getRefreshToken(), {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: refreshExpiration,
      });

      return res.status(response.getStatusCode()).json(response.toJSON());
    }

    return res.status(response.getStatusCode()).json(response);
  }

  async logout(req: Request, res: Response): Promise<Response> {
    const response = await service.AuthService.logout(req);

    if (response.getStatusCode() === 200) {
      res.clearCookie("refreshToken");
    }

    return res.status(response.getStatusCode()).json(response);
  }

  //getMe (get user info) controller
  async getMe(req: Request, res: Response): Promise<Response> {
    const response = await service.AuthService.getMe(req);
    return res.status(response.getStatusCode()).json(response);
  }
}

export default AuthController;
