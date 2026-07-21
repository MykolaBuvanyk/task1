import { rateLimit } from "express-rate-limit";

import { AppError } from "../utils/app-error";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (_req, _res, next) => {
    next(
      new AppError(
        429,
        "Too many failed login attempts. Please try again in 15 minutes",
      ),
    );
  },
});

export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(
      new AppError(
        429,
        "Too many registration attempts. Please try again later",
      ),
    );
  },
});
