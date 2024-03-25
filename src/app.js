import express from "express";
import errorMiddleware from "./middleware/errorMiddleware.js";
import { userRouter } from "./routers/userRouter.js";
import { receiptRouter } from "./routers/receiptRouter.js";
import { sequelize } from "./models/index.js";

const app = express();

// sequelize.sync({ force: true });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 기본 페이지
app.get("/", (req, res) => {
  res.send("This is my refrigerator project back server");
});
app.use("/api/user", userRouter);
app.use("/api/receipt", receiptRouter);

//
app.use(errorMiddleware);

export { app };
