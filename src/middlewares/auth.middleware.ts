import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import prisma from "../database/prisma";
import { AppError } from "../utils/app-error";

type TokenPayload = {
  id: number;
};

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const [type, token] = req.headers.authorization?.split(" ") ?? [];

  if (type !== "Bearer" || !token) {
    next(new AppError(401, "Authentication token is required"));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    const userId = Number(payload.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new AppError(401, "Invalid or expired token");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new AppError(401, "User no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError(401, "Invalid or expired token"));
  }
};
