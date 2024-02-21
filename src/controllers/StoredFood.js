import { StoredFoodModel } from "../models/StoredFoodModel";

export class StoredFoodController {
  static async getStoredFood({ foodId }) {
    return StoredFoodModel.find({
      where: {
        foodId,
      },
    });
  }
}
