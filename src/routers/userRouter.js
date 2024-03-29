import { Router } from "express";
import { UserController } from "../controllers/User.js";

const userRouter = Router();

userRouter.post("/signup", UserController.signupUser);
userRouter.post("/signin", UserController.loginUser);

export { userRouter };
