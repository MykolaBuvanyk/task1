import { Router } from "express";

import { login, register } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validation.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);

export default authRouter;
