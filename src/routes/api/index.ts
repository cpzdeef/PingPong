import { Router, Request, Response } from "express";

import { userRouter } from "./users";
import { gamesRouter } from "./games";
import { authRouter } from "./auth";

// create router
export const apiRouter = Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/games", gamesRouter);
apiRouter.use("/auth", authRouter);

apiRouter.get("/", (req: Request, res: Response) => {
  res.send("API is working!");
});
