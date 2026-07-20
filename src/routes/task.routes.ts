import { Router } from "express";

import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middlewares/validation.middleware";
import {
  createTaskSchema,
  taskIdParamsSchema,
  taskQuerySchema,
  updateTaskSchema,
} from "../validators/task.validator";

const taskRouter = Router();

taskRouter.use(authMiddleware);
taskRouter.post("/", validateBody(createTaskSchema), createTask);
taskRouter.get("/", validateQuery(taskQuerySchema), getTasks);
taskRouter.get("/:id", validateParams(taskIdParamsSchema), getTask);
taskRouter.patch(
  "/:id",
  validateParams(taskIdParamsSchema),
  validateBody(updateTaskSchema),
  updateTask,
);
taskRouter.delete("/:id", validateParams(taskIdParamsSchema), deleteTask);

export default taskRouter;
