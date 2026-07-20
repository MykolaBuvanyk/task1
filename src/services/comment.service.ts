import prisma from "../database/prisma";
import { AppError } from "../utils/app-error";
import type { CreateCommentInput } from "../validators/comment.validator";

const ensureTaskBelongsToUser = async (taskId: number, userId: number) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
    select: { id: true },
  });

  if (!task) {
    throw new AppError(404, "Task not found");
  }
};

export const createCommentForTask = async (
  taskId: number,
  userId: number,
  input: CreateCommentInput,
) => {
  await ensureTaskBelongsToUser(taskId, userId);

  return prisma.comment.create({
    data: {
      text: input.text,
      taskId,
      userId,
    },
  });
};

export const getCommentsForTask = async (taskId: number, userId: number) => {
  await ensureTaskBelongsToUser(taskId, userId);

  return prisma.comment.findMany({
    where: { taskId },
    orderBy: { createdAt: "asc" },
  });
};

export const deleteCommentForUser = async (commentId: number, userId: number) => {
  const result = await prisma.comment.deleteMany({
    where: { id: commentId, userId },
  });

  if (result.count === 0) {
    throw new AppError(404, "Comment not found");
  }
};
