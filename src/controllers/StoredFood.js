import { FoodModel } from "../models/FoodModel";
import { PurchaseReceiptItem } from "../models/PurchaseReceiptItem";
import { StoredFoodModel } from "../models/StoredFoodModel";

const getSort = {
  price: "purchase_price",
  expiryDate: "expiry_date",
  purchaseDate: "purchase_date",
};

export class StoredFoodController {
  static async getStoredFoods(req, res, next) {
    const { storage, sort, direction, cursor } = req.query;
    const limit = 8;

    const getOrder = () => {
      const order = direction === "down" ? "DESC" : "ASC";
      return [[getSort[sort], order]];
    };

    const whereCondition = {
      method: storage,
    };

    if (cursor) {
      whereCondition[getSort[sort]] = {
        [direction === "down" ? Op.lt : Op.gt]: cursor,
      };
    }

    try {
      const foundFoods = await PurchaseReceiptItem.findAll({
        where: whereCondition,
        order: getOrder(),
        limit: limit + 1,
        attributes: [
          "food_id",
          "image_url",
          "name",
          "purchase_date",
          "amount",
          "quantity",
          "unit",
          "expiry_date",
        ],
      });
      const hasNextPage = foundFoods.length === limit + 1;
      const nextCursor = hasNextPage
        ? foundFoods[limit - 1][getOrder(sort)]
        : null;
      if (hasNextPage) foundFoods.pop();

      return res.json({
        foods: foundFoods,
        nextCursor: nextCursor,
      });
    } catch (err) {
      console.log(err);
      //next(err)
    }
  }

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

  static async postStoredFood(req, res, next) {
    try {
      const foodData = await FoodModel.create({});
    } catch (err) {
      console.log(err);
    }
  }
}
