import { StoredFoodModel } from "../models/StoredFoodModel";

export class StoredFoodController {
  static async getStoredFood(req, res, next) {
    try {
      const storedFoodInfo = StoredFoodModel.find({
        where: {
          food_id: 123123,
          // food_id: req.params.foodId,
        },
      });
      res.json(storedFoodInfo);
    } catch (err) {
      console.log(err);
      // next(err)
      res.status(500).send("cannot get stored food data!");
    }
  }
}
