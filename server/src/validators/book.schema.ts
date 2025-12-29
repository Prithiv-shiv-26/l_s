import { z } from "zod";
const nameRegex = /^[a-zA-Z\s.'-]+$/;

export const createBookSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title is too long"),
  author: z
    .string()
    .trim()
    .min(1, "Author is required")
    .max(50, "Author name is too long")
    .regex(nameRegex, {
      message: "Author name contains invalid characters",
    }),
  isbn: z.string().trim().min(5, "ISBN is required").max(20),
  totalCopies: z.number().int().positive(),
});

export const updateBookSchema = createBookSchema
  .omit({ totalCopies: true })
  .partial()
  .extend({
    totalCopies: z.number().int().positive().optional(),
  });

export type updateBookInput = z.infer<typeof createBookSchema>;
export type createBookInput = z.infer<typeof createBookSchema>;
