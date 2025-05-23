import { z } from "zod";

export const authorSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    country: z.string().min(1, "Country is required"),
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  })
  .strict();
