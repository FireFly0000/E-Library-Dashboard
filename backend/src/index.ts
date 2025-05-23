import express from "express";
import authorRouter from "./routes/author.router";
import bookRouter from "./routes/book.router";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
); // Allow requests from the React app

app.use("/api/authors", authorRouter);
app.use("/api/books", bookRouter);
