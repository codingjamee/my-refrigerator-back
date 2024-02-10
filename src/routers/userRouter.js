import { Router } from "express";
import { UserController } from "../controllers/User.js";

const userRouter = Router();

userRouter.get("/", async (req, res, next) => {
  console.log("get userInfo");
  try {
    const userInfo = await UserController.getUser({ user_id: "jenner" });
    res.json(userInfo);
    console.log(userInfo.toJSON());
  } catch (err) {
    next(err);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
  } catch (err) {
    next(err);
  }
});

export { userRouter };
