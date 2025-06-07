import authorRouter from "./author.router";
import bookRouter from "./book.router";
import authRouter from "./auth.router";

const routers = {
  authRouter: authRouter,
  authorRouter: authorRouter,
  bookRouter: bookRouter,
};

export default routers;
