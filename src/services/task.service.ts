import { type Prisma } from "@prisma/client";

import prisma from "../database/prisma";
import { AppError } from "../utils/app-error";
import { getPagination } from "../utils/pagination";
import type {
  CreateTaskInput,
  TaskQuery,
  UpdateTaskInput,
} from "../validators/task.validator";

export const createTaskForUser = (userId: number, input: CreateTaskInput) => {
  return prisma.task.create({
    data: {
      ...input,
      userId,
    },
  });
};

export const getTasksForUser = async (userId: number, query: TaskQuery) => {
  const where: Prisma.TaskWhereInput = {
    userId,
    status: query.status,
    priority: query.priority,
    ...(query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: "insensitive" } },
            { description: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.TaskOrderByWithRelationInput = {
    [query.sort]: query.order,
  };
  const pagination = getPagination(query);

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      orderBy,
      ...pagination,
    }),
    prisma.task.count({ where }),
  ]);

  return {
    data: tasks,
    page: query.page,
    limit: query.limit,
    total,
  };
};

export const getTaskForUser = async (userId: number, taskId: number) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  return task;
};

export const updateTaskForUser = async (
  userId: number,
  taskId: number,
  input: UpdateTaskInput,
) => {
  await getTaskForUser(userId, taskId);

  return prisma.task.update({
    where: { id: taskId },
    data: input,
  });
};

export const deleteTaskForUser = async (userId: number, taskId: number) => {
  const result = await prisma.task.deleteMany({
    where: { id: taskId, userId },
  });

  if (result.count === 0) {
    throw new AppError(404, "Task not found");
  }
};
