import { Router } from "express";

import authRouter from "./auth.routes";
import commentRouter from "./comment.routes";
import taskRouter from "./task.routes";
import userRouter from "./user.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/tasks", taskRouter);
apiRouter.use(commentRouter);

export default apiRouter;
