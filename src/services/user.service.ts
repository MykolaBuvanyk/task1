import prisma from "../database/prisma";
import { AppError } from "../utils/app-error";

const publicUserFields = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const getAllUsers = () => {
  return prisma.user.findMany({
    select: publicUserFields,
    orderBy: { createdAt: "desc" },
  });
};

export const deleteUserById = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, avatar: true },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  await prisma.user.delete({ where: { id: userId } });
  return user;
};

export const updateAvatar = async (userId: number, avatar: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatar: true },
  });

  if (!existingUser) {
    throw new AppError(404, "User not found");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { avatar },
    select: publicUserFields,
  });

  return { user, previousAvatar: existingUser.avatar };
};
