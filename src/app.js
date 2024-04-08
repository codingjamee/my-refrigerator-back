import express from "express";
import errorMiddleware from "./middleware/errorMiddleware.js";
import { userRouter } from "./routers/userRouter.js";
import { receiptRouter } from "./routers/receiptRouter.js";
import { purchasedFoodRouter } from "./routers/purchasedFoodRouter.js";
import { User } from "./models/User.js";
import { v4 } from "uuid";
// import { sequelize } from "./models/index.js";

const app = express();

// sequelize.sync({ force: false });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 기본 페이지
app.get("/", (req, res) => {
  res.send("This is my refrigerator project back server");
});
app.use("/api/user", userRouter);
app.use("/api/receipt", receiptRouter);
app.use("/api/food", purchasedFoodRouter);
app.get("/api/test-connection", async (req, res) => {
  // DB test connection 코드
  await User.create({
    id: v4(),
    name: "jenner",
    email: "codingjamaee@gmail.com",
    password: "userconnecttest!",
  });
  return res.status(200).json("test");
});
app.use(errorMiddleware);

export { app };
