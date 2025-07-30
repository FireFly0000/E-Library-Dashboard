import AuthController from "./auth.controller";
import AuthorController from "./author.controller";
import BookController from "./book.controller";
import UserController from "./user.controller";

const controllers = {
  authController: new AuthController(),
  authorController: new AuthorController(),
  bookController: new BookController(),
  userController: new UserController(),
};

export default controllers;
