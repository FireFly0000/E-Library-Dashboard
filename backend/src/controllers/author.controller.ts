import { Request, Response } from "express";
import { convertJoiErrorToString } from "../commons/index";
import {
  getAllAuthorsPagingSchema,
  searchAuthorsByNameSchema,
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

    const response = await services.AuthorService.getAllAuthorsPaging(value);
    return res.status(response.getStatusCode()).json(response);
  };

  //filter authors by name controller
  searchAuthorsByName = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { error, value } = searchAuthorsByNameSchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }

    const response = await services.AuthorService.searchAuthorsByName(
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
