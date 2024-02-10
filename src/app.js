import express from "express";
import errorMiddleware from "./middleware/errorMiddleware.js";
import { userRouter } from "./routers/userRouter.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 기본 페이지
app.get("/", (req, res) => {
  res.send("This is my refrigerator project back server");
});
app.use("/user/api", userRouter);

//
app.use(errorMiddleware);

export { app };
