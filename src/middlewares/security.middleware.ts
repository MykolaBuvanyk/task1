import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "../config/env";
import { AppError } from "../utils/app-error";

const productionHsts = env.NODE_ENV === "production" ? undefined : false;

const apiHelmet = helmet({
  hsts: productionHsts,
  contentSecurityPolicy: {
    directives: {
      upgradeInsecureRequests: env.NODE_ENV === "production" ? [] : null,
    },
  },
});

const swaggerHelmet = helmet({
  hsts: productionHsts,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      upgradeInsecureRequests: env.NODE_ENV === "production" ? [] : null,
    },
  },
});

export const securityHeadersMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const isSwaggerRequest =
    env.SWAGGER_ENABLED &&
    (req.path === "/api-docs" || req.path.startsWith("/api-docs/"));

  const middleware = isSwaggerRequest ? swaggerHelmet : apiHelmet;
  middleware(req, res, next);
};

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    let normalizedOrigin: string;

    try {
      normalizedOrigin = new URL(origin).origin;
    } catch {
      callback(new AppError(403, "Origin is not allowed by CORS"));
      return;
    }

    if (env.CORS_ORIGINS.includes(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    callback(new AppError(403, "Origin is not allowed by CORS"));
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: false,
  maxAge: 86_400,
  optionsSuccessStatus: 204,
});
