import bcrypt from "bcrypt";

import prisma from "../database/prisma";
import type { LoginInput, RegisterInput } from "../validators/auth.validator";
import { AppError } from "../utils/app-error";
import { generateToken } from "../utils/jwt";

const publicUserFields = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError(409, "A user with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    },
    select: publicUserFields,
  });
};

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = generateToken({ id: user.id, role: user.role });

  const { password: _password, ...safeUser } = user;

  return { token, user: safeUser };
};
