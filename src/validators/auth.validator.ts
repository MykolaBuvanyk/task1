import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name must contain at most 100 characters"),
  email: z
    .string({ error: "Email is required" })
    .trim()
    .email("Invalid email address")
    .transform((email) => email.toLowerCase()),
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must contain at least 8 characters")
    .max(72, "Password must contain at most 72 characters"),
});

export const loginSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .trim()
    .email("Invalid email address")
    .transform((email) => email.toLowerCase()),
  password: z.string({ error: "Password is required" }).min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
