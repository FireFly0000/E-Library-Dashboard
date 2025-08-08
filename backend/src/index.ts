import express, { Application } from "express";
import cors from "cors";
import configs from "./configs/index";
import routers from "./routes/index";
import cookieParser from "cookie-parser";
import { workers } from "../src/utils/worker";

const app: Application = express();
const PORT = configs.general.PORT;
const DOMAIN_NAME = configs.general.DOMAIN_NAME;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: DOMAIN_NAME,
    credentials: true,
  })
); // Allow requests from the React app

app.use("/api/auth", routers.authRouter);
app.use("/api/authors", routers.authorRouter);
app.use("/api/books", routers.bookRouter);
app.use("/api/users", routers.userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//worker tasks (scheduled tasks)
workers.dailyCleanupTrash();
