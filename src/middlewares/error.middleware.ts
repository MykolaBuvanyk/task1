import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
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

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res.status(409).json({ message: "A resource with this value already exists" });
      return;
    }

    if (error.code === "P2025") {
      res.status(404).json({ message: "Resource not found" });
      return;
    }
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
};
