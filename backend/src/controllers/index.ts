import AuthController from "./auth.controller";
import AuthorController from "./author.controller";

const controllers = {
  authController: new AuthController(),
  authorController: new AuthorController(),
};

export default controllers;
