import type { NextFunction, Request, Response } from "express";

import { loginUser, registerUser } from "../services/auth.service";
import type { LoginInput, RegisterInput } from "../validators/auth.validator";

export const register = async (
  req: Request<unknown, unknown, RegisterInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<unknown, unknown, LoginInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
