import { Router } from "express";
import { StoredFoodController } from "../controllers/StoredFood";

const storedFoodRouter = Router();

storedFoodRouter.get("/:food_id", StoredFoodController.getStoredFood);
storedFoodRouter.post("/", StoredFoodController.postStoredFood);
