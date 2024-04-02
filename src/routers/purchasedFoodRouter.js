import { Router } from "express";
import { PurchasedFoodController } from "../controllers/PurchasedFood.js";

export const purchasedFoodRouter = Router();

purchasedFoodRouter.get("/", PurchasedFoodController.getFoodDetails);
purchasedFoodRouter.get("/:food_id", PurchasedFoodController.getFoodDetail);
purchasedFoodRouter.post("/:food_id", PurchasedFoodController.postStoredFood);
purchasedFoodRouter.put("/:food_id", PurchasedFoodController.putStoredFood);
purchasedFoodRouter.delete(
  "/:food_id",
  PurchasedFoodController.deleteStoredFood
);
