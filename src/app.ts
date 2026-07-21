import express from "express";
import swaggerUi from "swagger-ui-express";

import { swaggerDocument } from "./config/swagger";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import {
  corsMiddleware,
  securityHeadersMiddleware,
} from "./middlewares/security.middleware";
import apiRouter from "./routes";

const app = express();

if (env.TRUST_PROXY_HOPS > 0) {
  app.set("trust proxy", env.TRUST_PROXY_HOPS);
}

app.use(securityHeadersMiddleware);
app.use(corsMiddleware);
app.use(express.json());
app.use(loggerMiddleware);
app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

if (env.SWAGGER_ENABLED) {
  app.get("/api-docs.json", (_req, res) => res.json(swaggerDocument));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.get("/", (_req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.use(apiRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
