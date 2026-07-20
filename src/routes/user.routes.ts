import { Router } from "express";

import {
  deleteUser,
  getUsers,
  uploadUserAvatar,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { uploadAvatar } from "../middlewares/upload.middleware";
import { validateParams } from "../middlewares/validation.middleware";
import { userIdParamsSchema } from "../validators/user.validator";

const userRouter = Router();

userRouter.post(
  "/avatar",
  authMiddleware,
  uploadAvatar.single("avatar"),
  uploadUserAvatar,
);
userRouter.get("/", authMiddleware, checkRole("ADMIN"), getUsers);
userRouter.delete(
  "/:id",
  authMiddleware,
  checkRole("ADMIN"),
  validateParams(userIdParamsSchema),
  deleteUser,
);

export default userRouter;
