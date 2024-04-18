import { Food } from "../models/Food.js";
import { PurchasedFood } from "../models/PurchasedFood.js";
import Storage from "../models/Storage.js";
import StorageInfo from "../models/StorageInfo.js";
import { User } from "../models/User.js";
import { sequelize } from "../models/index.js";
import { Op } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

const getSort = {
  price: "purchase_price",
  expiryDate: "expiry_date",
  purchaseDate: "purchase_date",
};

export class PurchasedFoodController {
  static async getFoodDetails(req, res, next) {
    const { storage, sort, direction, page = 1 } = req.query;
    const user = req.user.id;
    const limit = 8;
    const offset = (+page - 1) * limit;
    console.log({ storage, sort, direction, page });
    console.log({ limit, offset });
    const getOrder = () => {
      const order = direction === "down" ? "DESC" : "ASC";
      return [[getSort[sort], order]];
    };
    const userInfo = await User.findOne({
      where: { email: user },
    });

    const whereCondition = {
      storage_info_id: {
        [Op.not]: null,
      },
      user_id: userInfo.id,
    };
    const whereStorageCondition = {};
    if (storage !== "total") {
      whereStorageCondition["method"] = storage;
    }

    try {
      //storage_info_id가 있는 것들 중 해당 user의 것만
      const purchasedFoods = await PurchasedFood.findAll({
        where: whereCondition,
        order: getOrder(),
        attributes: [
          "id",
          "food_id",
          "image_url",
          "purchase_date",
          "amount",
          "quantity",
          "expiry_date",
          "purchase_price",
          "storage_info_id",
        ],
        include: [{ model: StorageInfo, required: true }],
        limit: limit,
        offset: offset,
      });

      const totalItems = await PurchasedFood.count({
        include: [
          {
            model: StorageInfo,
            as: "storage_info",
            where: storage !== "total" ? { method: storage } : {},
            required: true,
          },
        ],
      });

      const totalPages = Math.ceil(totalItems / limit);

      const populatedFood = await Promise.all(
        purchasedFoods.map(async (food) => {
          const foodDetails = await Food.findOne({
            where: { id: food.food_id },
          });
          return {
            ...foodDetails.get({ plain: true }),
            ...food.get({ plain: true }),
          };
        })
      );

      return res.json({
        ok: true,
        foods: populatedFood,
        lastPage: totalPages,
        page: +page,
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
          food_id: foodId,
        },
        attributes: [
          "food_id",
          "storage_info_id",
          "image_url",
          "purchase_date",
          "purchase_price",
          "purchase_location",
          "registered",
          "expiry_date",
        ],
      });
      if (!storedFoodInfo) {
        return res.status(400).json({ message: "데이터가 없습니다" });
      }
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

      return res.json({ ...storedFoodInfo.dataValues, ok: true });
    } catch (err) {
      console.log(err);
      // next(err)
      return res.status(500).json({ message: "cannot get stored food data!" });
    }
  }

  static async postStoredFood(req, res, next) {
    const requestFoodId = req?.params.food_id;
    const requestBody = req.body;

    const userTransaction = await sequelize.transaction();
    let updateTransaction;
    let creationTransaction;

    try {
      const reqUser = req.user;
      console.log("jwt decoded id", reqUser.id);
      let foodData;
      let purchasedData;
      //storage를 생성해야함
      const user = await User.findOne({
        where: { email: reqUser.id },
        transaction: userTransaction,
      });
      const [storage] = await Storage.findOrCreate({
        where: { user_id: user.id },
        defaults: { user_id: user.id },
        transaction: userTransaction,
      });
      await userTransaction.commit();

      const storageInfo = await StorageInfo.create({
        storage_id: storage.id,
        method: requestBody.method,
        remaining_amount: requestBody.remaining_amount,
        remaining_quantity: requestBody.remaining_quantity,
      });
      if (requestFoodId) {
        updateTransaction = await sequelize.transaction();
        await Food.update(
          {
            name: requestBody.name,
            category: requestBody.category,
          },
          {
            where: {
              id: requestFoodId,
            },
            transaction: updateTransaction,
          }
        );
        await PurchasedFood.update(
          { ...requestBody, storage_info_id: storageInfo.id },
          {
            where: {
              food_id: requestFoodId,
            },
            transaction: updateTransaction,
          }
        );
        await updateTransaction.commit();
      } else {
        creationTransaction = await sequelize.transaction();
        foodData = await Food.create(
          {
            name: requestBody.name,
            category: requestBody.category,
          },
          { transaction: creationTransaction }
        );
        purchasedData = await PurchasedFood.create(
          {
            ...requestBody,
            user_id: user.id,
            food_id: foodData.id,
            storage_info_id: storageInfo.id,
            registered: true,
          },
          { transaction: creationTransaction }
        );
        await creationTransaction.commit();
      }

      return res.status(201).json({
        ok: true,
        message: "성공적으로 저장되었습니다",
        foodId: requestFoodId || purchasedData.id,
      });
    } catch (err) {
      if (userTransaction && !userTransaction.finished) {
        await userTransaction.rollback();
      }
      if (updateTransaction && !updateTransaction.finished) {
        await updateTransaction.rollback();
      }
      if (creationTransaction && !creationTransaction.finished) {
        await creationTransaction.rollback();
      }
      res.status(500).json({ message: "cannot post food data!" });
      console.log(err);
    }
  }

  static async putStoredFood(req, res, next) {
    const requestId = req.params.food_id;
    const { name, category, remaining_amount, remaining_quantity, method } =
      req.body;

    try {
      const transaction = await sequelize.transaction();
      const targetFood = await PurchasedFood.findOne({
        where: { food_id: requestId },
        transaction,
      });

      if (!targetFood) {
        await transaction.rollback();
        return res
          .status(404)
          .json({ message: "food 데이터를 찾을 수 없습니다." });
      }

      await targetFood.update(
        { remaining_amount, remaining_quantity, method },
        { transaction }
      );
      const targetStorageInfo = await StorageInfo.findOne({
        where: {
          id: targetFood.storage_info_id,
        },
        transaction,
      });
      if (targetStorageInfo) {
        await targetStorageInfo.update(
          {
            remaining_amount,
            remaining_quantity,
            method,
          },
          { transaction }
        );
      }
      if (name || category) {
        await Food.update(
          { name, category },
          { where: { id: requestId }, transaction }
        );
      }
      await transaction.commit();
      return res.status(200).json({
        ok: true,
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
      const onlyFoodData = await PurchasedFood.findOne({
        where: { food_id: requestId, receipt_id: null },
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
      if (onlyFoodData) {
        await targetData.destroy({ where: { food_id: requestId } });
        await Food.destroy({
          where: { id: onlyFoodData.food_id },
        });
      }
      await StorageInfo.destroy({
        where: { id: targetData.storage_info_id },
      });
    } catch (err) {
      console.log(err, "데이터를 삭제할 수 없습니다.");
      return res.status(500).json({ message: "삭제에 실패했습니다 " });
    }

    return res
      .status(200)
      .json({ ok: true, message: "삭제에 성공하였습니다." });
  }
}
