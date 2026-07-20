import type { NextFunction, Request, Response } from "express";

import {
  createTaskForUser,
  deleteTaskForUser,
  getTaskForUser,
  getTasksForUser,
  updateTaskForUser,
} from "../services/task.service";
import type {
  CreateTaskInput,
  TaskQuery,
  UpdateTaskInput,
} from "../validators/task.validator";

const getUserId = (req: { user?: Express.Request["user"] }): number => req.user!.id;

export const createTask = async (
  req: Request<unknown, unknown, CreateTaskInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const task = await createTaskForUser(getUserId(req), req.body);
    res.status(201).json({ data: task });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await getTasksForUser(
      getUserId(req),
      req.validatedQuery as TaskQuery,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const task = await getTaskForUser(getUserId(req), Number(req.params.id));
    res.status(200).json({ data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: Request<{ id: string }, unknown, UpdateTaskInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const task = await updateTaskForUser(
      getUserId(req),
      Number(req.params.id),
      req.body,
    );
    res.status(200).json({ data: task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await deleteTaskForUser(getUserId(req), Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
