import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must contain at least 32 characters"),
  CORS_ORIGINS: z
    .string()
    .default("http://localhost:3000,http://localhost:5173")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string().url()).min(1, "At least one CORS origin is required"))
    .transform((origins) => origins.map((origin) => new URL(origin).origin)),
  SWAGGER_ENABLED: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === "true")),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).default(0),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const messages = result.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid environment variables: ${messages}`);
}

export const env = {
  ...result.data,
  SWAGGER_ENABLED:
    result.data.SWAGGER_ENABLED ?? result.data.NODE_ENV !== "production",
};
