import { Request, Response } from "express";
import { convertJoiErrorToString } from "../commons/index";
import services from "../services/index";
import {
  moveBookVersionToTrashSchema,
  getUserProfileSchema,
  updateUserProfileImgSchema,
  updateUserBasicInfoSchema,
  recoverTrashedBookVersionSchema,
  deleteBookVersionSchema,
} from "../validations/user";

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

  updateUserProfileImg = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const payload = {
      profileId: Number(req.body.profileId),
      profileImg: req.file,
    };

    const { error, value } = updateUserProfileImgSchema.validate(payload);

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }

    const response = await services.UserService.updateUserProfileImg(
      req,
      value
    );
    return res.status(response.getStatusCode()).json(response);
  };

  moveBookVersionToTrash = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { error, value } = moveBookVersionToTrashSchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }

    const response = await services.UserService.moveBookVersionToTrash(
      req,
      value
    );
    return res.status(response.getStatusCode()).json(response);
  };

  updateUserBasicInfo = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { error, value } = updateUserBasicInfoSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }

    const response = await services.UserService.updateUserBasicInfo(req, value);
    return res.status(response.getStatusCode()).json(response);
  };

  getBookVersionsInTrash = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const response = await services.UserService.getBookVersionsInTrash(req);
    return res.status(response.getStatusCode()).json(response);
  };

  recoverTrashedBookVersion = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { error, value } = recoverTrashedBookVersionSchema.validate(
      req.query
    );

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }

    const response = await services.UserService.recoverTrashedBookVersion(
      req,
      value
    );
    return res.status(response.getStatusCode()).json(response);
  };

  deleteBookVersion = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { error, value } = deleteBookVersionSchema.validate(req.params);

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }

    const response = await services.UserService.deleteBookVersion(req, value);
    return res.status(response.getStatusCode()).json(response);
  };
}

export default UserController;
