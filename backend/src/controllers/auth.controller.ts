import { Request, Response } from "express";
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons/index";
import {
  registrationSchema,
  loginSchema,
  updateEmailSchema,
  updatePasswordSchema,
} from "../validations/auth";
import service from "../services/index";
import { ResponseWithToken } from "../commons/response";
import ms from "ms";
import configs from "../configs/index";
import { isMobileDevice } from "../utils/helper";

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
      //if mobile set refreshToken in frontend
      if (isMobileDevice(req)) {
        return res.status(response.getStatusCode()).json(response.toJSON());
      } else {
        const refreshExpiration = ms(
          configs.general.TOKEN_REFRESH_EXPIRED_TIME || "15d"
        );

        res.cookie("refreshToken", response.getRefreshToken(), {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: refreshExpiration,
        });

        res.cookie("sessionId", response.getSessionId(), {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: refreshExpiration,
        });

        await response.clearRefreshToken();
        await response.clearSessionId();

        return res.status(response.getStatusCode()).json(response.toJSON());
      }
    }

    return res.status(response.getStatusCode()).json(response);
  };

  //refresh token controller
  async refreshToken(req: Request, res: Response): Promise<Response> {
    const response = await service.AuthService.refreshToken(req);
    if (response instanceof ResponseWithToken) {
      //if mobile set refreshToken in frontend
      if (isMobileDevice(req)) {
        return res.status(response.getStatusCode()).json(response.toJSON());
      } else {
        const refreshExpiration = ms(
          configs.general.TOKEN_REFRESH_EXPIRED_TIME || "15d"
        );

        res.cookie("refreshToken", response.getRefreshToken(), {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: refreshExpiration,
        });

        res.cookie("sessionId", response.getSessionId(), {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: refreshExpiration,
        });

        await response.clearRefreshToken();
        await response.clearSessionId();

        return res.status(response.getStatusCode()).json(response.toJSON());
      }
    }

    return res.status(response.getStatusCode()).json(response);
  }

  async logout(req: Request, res: Response): Promise<Response> {
    const response = await service.AuthService.logout(req);

    if (response.getStatusCode() === 200) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.clearCookie("sessionId", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
    }

    return res.status(response.getStatusCode()).json(response);
  }

  //getMe (get user info) controller
  async getMe(req: Request, res: Response): Promise<Response> {
    const response = await service.AuthService.getMe(req);
    return res.status(response.getStatusCode()).json(response);
  }

  async getUserSessions(req: Request, res: Response): Promise<Response> {
    const response = await service.AuthService.getUserSessions(req);
    return res.status(response.getStatusCode()).json(response);
  }

  async logoutSession(req: Request, res: Response): Promise<Response> {
    const response = await service.AuthService.logoutSession(req);
    return res.status(response.getStatusCode()).json(response);
  }

  async updateEmail(req: Request, res: Response): Promise<Response> {
    const { error, value } = updateEmailSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }
    const response = await service.AuthService.updateEmail(req, value);
    if (response.getStatusCode() === 200) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.clearCookie("sessionId", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
    }
    return res.status(response.getStatusCode()).json(response);
  }

  async updatePassword(req: Request, res: Response): Promise<Response> {
    const { error, value } = updatePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }
    const response = await service.AuthService.updatePassword(req, value);
    if (response.getStatusCode() === 200) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.clearCookie("sessionId", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
    }
    return res.status(response.getStatusCode()).json(response);
  }
}

export default AuthController;
