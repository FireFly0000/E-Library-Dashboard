import AuthController from "./auth.controller";
import AuthorController from "./author.controller";
import BookController from "./book.controller";
import SystemController from "./system.controller";
import UserController from "./user.controller";

const controllers = {
  authController: new AuthController(),
  authorController: new AuthorController(),
  bookController: new BookController(),
  userController: new UserController(),
  systemController: new SystemController(),
};

export default controllers;
