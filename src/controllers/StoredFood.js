import { Food } from "../models/Food";
import { PurchaseReceiptItem } from "../models/PurchasedFood";

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

  //food id 상세 데이터 조회
  static async getStoredFood(req, res, next) {
    const foodId = req.params.food_id;
    try {
      const storedFoodInfo = await PurchaseReceiptItem.findOne({
        include: [
          {
            model: Food,
            where: {
              food_id: foodId,
            },
            required: true,
          },
        ],
      });

      const storedFoodName = await Food.findOne({
        where: {
          id: storedFoodInfo.food_id,
        },
      });
      storedFoodInfo.dataValues.name = storedFoodName.name;
      storedFoodInfo.dataValues.category = storedFoodName.category;

      res.json(storedFoodInfo);
    } catch (err) {
      console.log(err);
      // next(err)
      res.status(500).send("cannot get stored food data!");
    }
  }

  static async postStoredFood(req, res, next) {
    const requestFoodId = req?.params.food_id;
    const requestBody = req.body;
    const transaction = await sequelize.transaction();

    try {
      let foodData;
      if (requestFoodId) {
        await Food.update(
          {
            name: requestBody.name,
            category: requestBody.category,
          },
          {
            where: {
              id: requestFoodId,
            },
          },
          { transaction }
        );
        await PurchaseReceiptItem.update(
          { ...requestBody },
          {
            where: {
              food_id: requestFoodId,
            },
          },
          { transaction }
        );
        await transaction.commit();
      } else {
        foodData = await Food.create(
          {
            name: item.name,
            category: item.category,
          },
          { transaction }
        );
        await PurchaseReceiptItem.create({
          ...requestBody,
          food_id: foodData.id,
        });
        await transaction.commit();
      }

      return res.status(201).json({
        message: "성공적으로 저장되었습니다",
        foodId: requestFoodId || foodData.id,
      });
    } catch (err) {
      await transaction.rollback();
      res.status(500).send("cannot post food data!");
      console.log(err);
    }
  }

  static async putStoredFood(req, res, next) {
    const requestId = req.params.food_id;
    const requestUpdateData = req.body;
    const updateData = (() => {
      const data = {};
      if (requestUpdateData.name) {
        data.name = requestUpdateData.name;
      }
      if (requestUpdateData.category)
        data.category = requestUpdateData.category;
      {
      }
      return {
        need: Object.keys(data).length > 0,
        data,
      };
    })();

    try {
      await PurchaseReceiptItem.update(
        { ...requestUpdateData },
        {
          where: { food_id: requestId },
        }
      );

      if (updateData.need) {
        await Food.update(
          { ...updateData.data },
          {
            where: { food_id: requestId },
          }
        );
      }

      return res.status(200).json({
        message: "food data updated successfully",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Serever Error!!! when updating food data!",
      });
    }
  }
  static async deleteStoredFood(req, res, next) {
    const requestId = req.params.food_id;
    try {
      const deleteResult = await PurchaseReceiptItem.destroy({
        where: {},
      });
    } catch (err) {
      console.log(err);
    }
  }
}
