import { Router } from "express";
import { UserController } from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const userRouter = Router();

userRouter.post("/signup", UserController.signupUser);
userRouter.post("/signin", UserController.loginUser);
userRouter.get("/logout", UserController.logoutUser);
userRouter.get("/info", verifyToken, UserController.userInfo);

export { userRouter };
