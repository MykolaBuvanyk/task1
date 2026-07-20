import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { swaggerDocument } from "./config/swagger";
import { errorMiddleware } from "./middlewares/error.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import apiRouter from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
app.use("/uploads", express.static("uploads"));
app.get("/api-docs.json", (_req, res) => res.json(swaggerDocument));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (_req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.use(apiRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
