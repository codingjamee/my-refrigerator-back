import { Router } from "express";
import { StoredFoodController } from "../controllers/StoredFood.js";

export const storedFoodRouter = Router();

storedFoodRouter.get("/", StoredFoodController.getFoodDetails);
storedFoodRouter.get("/:food_id", StoredFoodController.getFoodDetail);
storedFoodRouter.post("/:food_id", StoredFoodController.postStoredFood);
storedFoodRouter.put("/:food_id", StoredFoodController.putStoredFood);
storedFoodRouter.delete("/:food_id", StoredFoodController.deleteStoredFood);
