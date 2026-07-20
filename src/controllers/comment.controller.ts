import type { NextFunction, Request, Response } from "express";

import {
  createCommentForTask,
  deleteCommentForUser,
  getCommentsForTask,
} from "../services/comment.service";
import type { CreateCommentInput } from "../validators/comment.validator";

export const createComment = async (
  req: Request<{ id: string }, unknown, CreateCommentInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const comment = await createCommentForTask(
      Number(req.params.id),
      req.user!.id,
      req.body,
    );
    res.status(201).json({ data: comment });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const comments = await getCommentsForTask(
      Number(req.params.id),
      req.user!.id,
    );
    res.status(200).json({ data: comments });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await deleteCommentForUser(Number(req.params.id), req.user!.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
