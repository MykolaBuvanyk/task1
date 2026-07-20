import { Router } from "express";

import {
  createComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  validateBody,
  validateParams,
} from "../middlewares/validation.middleware";
import {
  commentIdParamsSchema,
  createCommentSchema,
} from "../validators/comment.validator";
import { taskIdParamsSchema } from "../validators/task.validator";

const commentRouter = Router();

commentRouter.post(
  "/tasks/:id/comments",
  authMiddleware,
  validateParams(taskIdParamsSchema),
  validateBody(createCommentSchema),
  createComment,
);
commentRouter.get(
  "/tasks/:id/comments",
  authMiddleware,
  validateParams(taskIdParamsSchema),
  getComments,
);
commentRouter.delete(
  "/comments/:id",
  authMiddleware,
  validateParams(commentIdParamsSchema),
  deleteComment,
);

export default commentRouter;
