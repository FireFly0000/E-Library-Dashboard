import authorRouter from "./author.router";
import bookRouter from "./book.router";
import authRouter from "./auth.router";
import userRouter from "./user.router";

const routers = {
  authRouter: authRouter,
  authorRouter: authorRouter,
  bookRouter: bookRouter,
  userRouter: userRouter,
};

export default routers;
