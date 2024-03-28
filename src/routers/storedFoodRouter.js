import { Router } from "express";
import { StoredFoodController } from "../controllers/StoredFood";

export const storedFoodRouter = Router();

storedFoodRouter.get("/", StoredFoodController.getStoredFoods);
storedFoodRouter.get("/:food_id", StoredFoodController.getStoredFood);
storedFoodRouter.post("/:food_id", StoredFoodController.postStoredFood);
storedFoodRouter.put("/:food_id", StoredFoodController.putStoredFood);
