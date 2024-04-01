import { Receipt } from "../models/Receipt.js";
import { Food } from "../models/Food.js";
import { PurchasedFood } from "../models/PurchasedFood.js";
import { sequelize } from "../models/index.js";
import { Op } from "sequelize";

const parseDateString = (YM) => {
  const [year, month, date] = YM.split(".").map(Number);
  const fullYear = 2000 + year;
  return { year: fullYear, month, date };
};

export class ReceiptController {
  //특정 월의 영수증들 가져오기
  static async getReceipts(req, res, next) {
    const { year, month } = parseDateString(req.query.month);
    const { cursor } = req.query;
    const searchStartDate = new Date(year, month - 1, 1);
    const searchEndDate = new Date(year, month, 0);
    const limit = 5;

    const whereCondition = {
      purchase_date: {
        [Op.gte]: searchStartDate,
        [Op.lte]: searchEndDate,
      },
    };

    if (cursor && cursor !== "1") {
      whereCondition.id = {
        [Op.lt]: Number(cursor),
      };
    }

    const foundReceipts = await Receipt.findAll({
      where: whereCondition,
      order: [
        ["purchase_date", "DESC"],
        ["id", "DESC"],
      ],
      attributes: ["id", "purchase_location", "purchase_date", "total_price"],
      limit: limit + 1,
    });

    const hasNextPage = foundReceipts.length === limit + 1;
    const nextCursor = hasNextPage ? foundReceipts[limit - 1].id : null;

    if (hasNextPage) foundReceipts.pop();
    const receiptItemCount = await Promise.all(
      foundReceipts.map(async (receipt) => {
        return await PurchasedFood.count({
          where: { receipt_id: receipt.id },
        });
      })
    );

    foundReceipts.forEach((receipt, index) => {
      receipt.dataValues.quantity = receiptItemCount[index];
    });

    return res.json({
      receipts: foundReceipts,
      nextCursor: nextCursor,
    });
  }

  //영수증 상세
  static async getReceipt(req, res, next) {
    const requestId = req.params.receipt_id;
    try {
      const receiptInfo = await Receipt.findOne({
        where: {
          id: requestId,
        },
        attributes: ["id", "purchase_location", "purchase_date", "total_price"],
      });
      const receiptItems = await PurchasedFood.findAll({
        where: {
          receipt_id: requestId,
        },
        attributes: [
          "id",
          "image_url",
          "amount",
          "purchase_price",
          "registered",
          "food_id",
          "purchase_location",
          "purchase_date",
        ],
      });
      const receiptItemsWithFoodName = await Promise.all(
        receiptItems.map(async (item) => {
          const food = await Food.findOne({
            where: { id: item.food_id },
          });
          return {
            ...item.dataValues,
            name: food ? food.name : null,
            category: food ? food.category : null,
          };
        })
      );
      if (receiptInfo) {
        receiptInfo.dataValues.receipt_items = receiptItemsWithFoodName;
        receiptItemsWithFoodName.forEach((item) => delete item.food_id);
        console.log({ receiptInfo });
        return res.status(200).json(receiptInfo);
      } else {
        return res.status(404).send("Receipt not found!");
      }
    } catch (err) {
      console.log(err);
      // next(err)
      return res.status(500).send("cannot get receipt data!");
    }
  }

  static async postReceipt(req, res, next) {
    const { total_price, purchase_date, receipt_items, purchase_location } =
      req.body;
    console.log("request body!!!", req.body);
    const transaction = await sequelize.transaction();
    try {
      const receiptData = new Receipt(
        {
          user_id: "da13b21f-49f9-4bc0-9e1b-f64ca37c6e91",
          total_price,
          purchase_date,
          receipt_items,
          purchase_location,
        },
        { transaction }
      );
      await receiptData.save();
      await Promise.all(
        receipt_items.map(async (item) => {
          const foodData = await Food.create(
            {
              name: item.name,
              category: item.category,
            },
            { transaction }
          );
          await PurchasedFood.create(
            {
              ...item,
              user_id: "da13b21f-49f9-4bc0-9e1b-f64ca37c6e91", //추후 변경
              amount: item.amount || 0,
              receipt_id: receiptData.id,
              food_id: foodData.id,
              registered: false,
              purchase_location: purchase_location,
              purchase_date: purchase_date,
            },
            { transaction }
          );
        })
      );

      await transaction.commit();
      return res.status(201).json({
        message: "영수증 저장이 정상적으로 처리되었습니다.",
        receipt_id: receiptData.id,
      });
    } catch (err) {
      await transaction.rollback();
      console.log(err);
      return res.status(500).send("cannot post receipt data!");
      // next(err)
    }
  }
  static async putReceipt(req, res, next) {
    const requestId = req.params.receipt_id;
    const registeredBool = req.body.registered;

    try {
      const updateReceipt = await PurchasedFood.update(
        {
          registered: registeredBool,
        },
        {
          where: {
            receipt_id: requestId,
          },
        }
      );

      if (updateReceipt[0] > 0) {
        return res
          .status(200)
          .json({ message: "receipt registered status updated successfully." });
      } else {
        return res.status(404).json({
          message: "update receipt data not found.",
        });
      }
    } catch (err) {
      console.log("Error!!! when update receipt status", err);
      return res
        .status(500)
        .json({ message: "Server Error!!! when update receipt status" });
    }
  }
  static async deleteReceipt(req, res, next) {
    const requestId = req.params.receipt_id;
    try {
      const deleteResult = await Receipt.destroy({
        where: { requestId },
      });

      //삭제했을 때 PurchaseReceiptItem의 처리
      if (deleteResult > 0) {
        return res
          .status(200)
          .json({ message: "Receipt deleted successfully." });
      } else {
        return res.status(404).json({ message: "Receipt not found." });
      }
    } catch (error) {
      console.error("Error deleting receipt:", error);
      return res.status(500).json({ message: "Error deleting receipt." });
    }
  }
}
