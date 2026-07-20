import { z } from "zod";

import { positiveIdParamsSchema } from "./common.validator";

const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);
const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const createTaskSchema = z
  .object({
    title: z
      .string({ error: "Title is required" })
      .trim()
      .min(1, "Title is required")
      .max(200, "Title must contain at most 200 characters"),
    description: z
      .string()
      .trim()
      .max(5000, "Description must contain at most 5000 characters")
      .optional(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
  })
  .strict();

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title must contain at most 200 characters")
      .optional(),
    description: z
      .string()
      .trim()
      .max(5000, "Description must contain at most 5000 characters")
      .nullable()
      .optional(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
  })
  .strict()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field must be provided",
  });

export const taskIdParamsSchema = positiveIdParamsSchema("Task");

export const taskQuerySchema = z.object({
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  search: z.string().trim().max(200).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.enum(["createdAt", "priority", "title"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQuery = z.infer<typeof taskQuerySchema>;
