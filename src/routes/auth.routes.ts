import { Router } from "express";

import { login, register } from "../controllers/auth.controller";
import {
  loginRateLimiter,
  registerRateLimiter,
} from "../middlewares/rate-limit.middleware";
import { validateBody } from "../middlewares/validation.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const authRouter = Router();

authRouter.post(
  "/register",
  registerRateLimiter,
  validateBody(registerSchema),
  register,
);
authRouter.post("/login", loginRateLimiter, validateBody(loginSchema), login);

export default authRouter;
