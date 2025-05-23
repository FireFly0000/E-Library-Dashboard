import { Router } from "express";
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  filterAuthorsByName,
} from "../controllers/author.controller";
import { rateLimit } from "express-rate-limit";

const authorRouter = Router();

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per windowMs
});

authorRouter.get("/", getAllAuthors);
authorRouter.get("/filter", filterAuthorsByName); // Filter authors by name
authorRouter.get("/:id", getAuthorById);
authorRouter.post("/", createAuthor);
authorRouter.put("/:id", updateAuthor);
authorRouter.delete("/:id", deleteAuthor);

export default authorRouter;
