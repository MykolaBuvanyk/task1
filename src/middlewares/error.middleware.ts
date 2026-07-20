import type { ErrorRequestHandler } from "express";
import multer from "multer";
import { ZodError } from "zod";

import { AppError } from "../utils/app-error";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Avatar must be no larger than 5 MB"
        : error.message;

    res.status(400).json({ message });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
};
