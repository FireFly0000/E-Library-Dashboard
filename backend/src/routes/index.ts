import authorRouter from "./author.router";
import bookRouter from "./book.router";
import authRouter from "./auth.router";
import userRouter from "./user.router";
import systemRouter from "./system.router";

const routers = {
  authRouter: authRouter,
  authorRouter: authorRouter,
  bookRouter: bookRouter,
  userRouter: userRouter,
  systemRouter: systemRouter,
};

export default routers;
