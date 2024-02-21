import { Router } from "express";
import { StoredFoodController } from "../controllers/StoredFood";

const storedFoodRouter = Router();

storedFoodRouter.get("/", async (req, res, next) => {
  try {
    const storedFoodInfo = await StoredFoodController.getStoredFood({
      foodId: 123123,
    });
    res.json(storedFoodInfo);
  } catch (err) {
    console.log(err);
  }
});
