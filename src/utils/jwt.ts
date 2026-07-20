import jwt from "jsonwebtoken";

import { env } from "../config/env";

type JwtUser = {
  id: number;
  role: "USER" | "ADMIN";
};

export const generateToken = (user: JwtUser): string => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};
