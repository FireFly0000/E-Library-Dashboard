import { z } from "zod";
import { Book } from "@prisma/client";

export const bookSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    authorId: z
      .number()
      .int()
      .nonnegative("Author ID must be a non-negative integer")
      .default(0),
    fileName: z.string().min(1, "fileName is required"),
    author: z
      .object({
        name: z.string().min(1, "Author name is required"),
        country: z.string().min(1, "Country is required"),
        dateOfBirth: z.string().min(1, "Date of birth is required"),
      })
      .optional()
      .nullable(),
  })
  .strict();

export type BookWithSignedUrl = Book & { fileUrl: string };
