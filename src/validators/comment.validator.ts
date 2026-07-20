import { z } from "zod";

import { positiveIdParamsSchema } from "./common.validator";

export const createCommentSchema = z
  .object({
    text: z
      .string({ error: "Comment text is required" })
      .trim()
      .min(1, "Comment text is required")
      .max(2000, "Comment must contain at most 2000 characters"),
  })
  .strict();

export const commentIdParamsSchema = positiveIdParamsSchema("Comment");

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
