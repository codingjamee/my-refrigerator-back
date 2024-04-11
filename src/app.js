import express from "express";
import errorMiddleware from "./middleware/errorMiddleware.js";
import { userRouter } from "./routers/userRouter.js";
import { receiptRouter } from "./routers/receiptRouter.js";
import { purchasedFoodRouter } from "./routers/purchasedFoodRouter.js";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/verifyToken.js";
// import { sequelize } from "./models/index.js";

const app = express();

// sequelize.sync({ force: false });
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 기본 페이지
app.get("/", (req, res) => {
  res.send("This is my refrigerator project back server");
});
app.use("/api/user", userRouter);
app.use("/api/receipt", verifyToken, receiptRouter);
app.use("/api/food", verifyToken, purchasedFoodRouter);
app.use(errorMiddleware);

export { app };
