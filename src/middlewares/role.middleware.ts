import type { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/app-error";

type Role = "USER" | "ADMIN";

export const checkRole = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      next(new AppError(403, "Access denied"));
      return;
    }

    next();
  };
};
