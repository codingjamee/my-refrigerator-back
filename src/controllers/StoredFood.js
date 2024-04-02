import { Food } from "../models/Food.js";
import { PurchasedFood } from "../models/PurchasedFood.js";
import StorageInfo from "../models/StorageInfo.js";
import { sequelize } from "../models/index.js";
import { Op } from "sequelize";

const getSort = {
  price: "purchase_price",
  expiryDate: "expiry_date",
  purchaseDate: "purchase_date",
};

export class StoredFoodController {
  static async getFoodDetails(req, res, next) {
    const { storage, sort, direction, cursor } = req.query;
    const limit = 8;

    const getOrder = () => {
      const order = direction === "down" ? "DESC" : "ASC";
      return [[getSort[sort], order]];
    };

    const whereCondition = {
      method: storage ? storage : "",
    };

    if (cursor) {
      whereCondition[getSort[sort]] = {
        [direction === "down" ? Op.lt : Op.gt]: cursor,
      };
    }

    try {
      const foundFoods = await PurchasedFood.findAll({
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
  static async getFoodDetail(req, res, next) {
    const foodId = req.params.food_id;
    try {
      const storedFoodInfo = await PurchasedFood.findOne({
        where: {
          id: foodId,
          storage_info_id: {
            [Op.not]: null,
          },
        },
        attributes: [
          "food_id",
          "storage_info_id",
          "image_url",
          "purchase_price",
          "purchase_location",
          "registered",
          "expiry_date",
        ],
        required: true,
      });
      if (!storedFoodInfo)
        return res.status(400).json({ message: "데이터가 없습니다" });
      const storedFoodName = await Food.findOne({
        where: {
          id: storedFoodInfo.food_id,
        },
      });
      const storageInfo = await StorageInfo.findOne({
        where: {
          id: storedFoodInfo.storage_info_id,
        },
        attributes: ["method", "remaining_amount", "remaining_quantity"],
      });
      storedFoodInfo.dataValues.method = storageInfo.method;
      storedFoodInfo.dataValues.remaining_amount = storageInfo.remaining_amount;
      storedFoodInfo.dataValues.remaining_quantity =
        storageInfo.remaining_quantity;
      storedFoodInfo.dataValues.name = storedFoodName.name;
      storedFoodInfo.dataValues.category = storedFoodName.category;

      return res.json(storedFoodInfo);
    } catch (err) {
      console.log(err);
      // next(err)
      return res.status(500).send("cannot get stored food data!");
    }
  }

  static async postStoredFood(req, res, next) {
    const requestFoodId = req?.params.food_id;
    const requestBody = req.body;
    const transaction = await sequelize.transaction();

    try {
      let foodData;
      const storageInfo = await StorageInfo.create({
        storage_id: 5,
        method: requestBody.method,
        remaining_amount: requestBody.remaining_amount,
        remaining_quantity: requestBody.remaining_quantity,
      });
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
        await PurchasedFood.update(
          { ...requestBody, storage_info_id: storageInfo.id },
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
        await PurchasedFood.create({
          ...requestBody,
          food_id: foodData.id,
          storage_info_id: storageInfo.id,
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
      await PurchasedFood.update(
        { ...requestUpdateData },
        {
          where: { id: requestId },
        }
      );

      if (updateData.need) {
        await Food.update(
          { ...updateData.data },
          {
            where: { id: requestId },
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
      const targetData = await PurchasedFood.findOne({
        where: { food_id: requestId },
      });
      if (!targetData) {
        return res
          .status(404)
          .json({ message: "해당 데이터를 찾을 수 없습니다." });
      }

      await targetData.update(
        { storage_info_id: null },
        { where: { food_id: requestId } }
      );
      await StorageInfo.destroy({
        where: { id: targetData.storage_info_id },
      });
    } catch (err) {
      console.log(err, "데이터를 삭제할 수 없습니다.");
      return res.status(500).json({ message: "삭제에 실패했습니다 " });
    }

    return res.status(200).json({ message: "삭제에 성공하였습니다." });
  }
}
