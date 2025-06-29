import { Request, Response } from "express";
import { convertJoiErrorToString } from "../commons/index";
import {
  getAllAuthorsPagingSchema,
  filterAuthorsByNameSchema,
  createAuthorSchema,
} from "../validations/author";
import services from "../services/index";
//import { ValidationError } from "joi";

class AuthorController {
  // Get all authors with paging controller
  getAllAuthorsPaging = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { error, value } = getAllAuthorsPagingSchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }

    const response = await services.AuthorService.getAllAuthorsPaging(
      req,
      value
    );
    return res.status(response.getStatusCode()).json(response);
  };

  //filter authors by name controller
  filterAuthorsByName = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { error, value } = filterAuthorsByNameSchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }

    const response = await services.AuthorService.filterAuthorsByName(
      req,
      value
    );
    return res.status(response.getStatusCode()).json(response);
  };

  createAuthor = async (req: Request, res: Response): Promise<Response> => {
    const { error, value } = createAuthorSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }

    const response = await services.AuthorService.createAuthor(req, value);
    return res.status(response.getStatusCode()).json(response);
  };
}

export default AuthorController;
