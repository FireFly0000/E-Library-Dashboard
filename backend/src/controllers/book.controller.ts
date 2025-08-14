import { Request, Response } from "express";
import { convertJoiErrorToString } from "../commons/index";
import services from "../services/index";
import {
  createBookSchema,
  getAllBooksPagingSchema,
  getBooksByTitleAndAuthorSchema,
  getBookVersionsByIdSchema,
  AIContentSchema,
  updateBooksViewsSchema,
  getBooksPagingByAuthorIdSchema,
} from "../validations/book";
import { RequestHasLogin } from "types/request.type";

class BookController {
  createBook = async (
    req: RequestHasLogin,
    res: Response
  ): Promise<Response> => {
    const files = req.files as Record<string, Express.Multer.File[]>;

    const payload = {
      title: req.body.title === "null" ? null : req.body.title,
      authorId: req.body.authorId === "null" ? null : Number(req.body.authorId),
      author:
        req.body.authorName !== "null" && req.body.authorCountry !== "null"
          ? {
              name: req.body.authorName,
              country: req.body.authorCountry,
            }
          : null,
      category: req.body.category,
      description:
        req.body.description === "null" ? null : req.body.description,
      thumbnail: files.thumbnail || null,
      bookVersion: {
        userId: Number(req.user_id),
        bookId: req.body.bookId === "null" ? null : Number(req.body.bookId),
        bookFile: files.bookFile,
      },
    };

    const { error, value } = createBookSchema.validate(payload);

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

  getAllBooksPaging = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { error, value } = getAllBooksPagingSchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }
    const response = await services.BookService.getAllBooksPaging(value);
    return res.status(response.getStatusCode()).json(response);
  };

  getBooksByTitleAndAuthor = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { error, value } = getBooksByTitleAndAuthorSchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }
    const response = await services.BookService.getBooksByTiTleAndAuthor(
      req,
      value
    );
    return res.status(response.getStatusCode()).json(response);
  };

  getBookVersions = async (req: Request, res: Response): Promise<Response> => {
    const { error, value } = getBookVersionsByIdSchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }

    const response = await services.BookService.getBookVersions(value);
    return res.status(response.getStatusCode()).json(response);
  };

  updateBooksViews = async (req: Request, res: Response): Promise<Response> => {
    const { error, value } = updateBooksViewsSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const paramsWithIp = {
      ...value,
      ip,
    };
    const response = await services.BookService.updateBooksViews(
      req,
      paramsWithIp
    );
    return res.status(response.getStatusCode()).json(response);
  };

  AIContentServices = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { error, value } = AIContentSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }

    const response = await services.BookService.AIContentServices(value);
    return res.status(response.getStatusCode()).json(response);
  };

  getBooksPagingByAuthorID = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { error, value } = getBooksPagingByAuthorIdSchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: convertJoiErrorToString(error),
        success: false,
      });
    }

    const response = await services.BookService.getBooksPagingByAuthorID(value);
    return res.status(response.getStatusCode()).json(response);
  };
}

export default BookController;
