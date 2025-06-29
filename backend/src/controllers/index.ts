import AuthController from "./auth.controller";
import AuthorController from "./author.controller";
import BookController from "./book.controller";

const controllers = {
  authController: new AuthController(),
  authorController: new AuthorController(),
  bookController: new BookController(),
};

export default controllers;
