import { z } from "zod";

export const Visibility = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
} as const;

export const postZodSchema = z.object({
  body: z.object({
    text: z.string().min(1, "Text is required"),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    // visibility: z.enum([Visibility.PUBLIC, Visibility.PRIVATE]),
  }),
});
