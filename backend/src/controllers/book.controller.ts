import { Request, Response } from "express";
import { convertJoiErrorToString } from "../commons/index";
import services from "../services/index";
import { createAuthorSchema } from "../validations/author";

class BookController {
  createAuthor = async (req: Request, res: Response): Promise<Response> => {
    const { error, value } = createAuthorSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }

    const response = await services.BookService.createBook(req, value);
    return res.status(response.getStatusCode()).json(response);
  };
}

export default BookController;
