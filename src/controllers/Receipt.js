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
    const { year, month } = parseDateString(req.params.month);
    const { cursor } = req.params;
    const searchStartDate = new Date(year, month - 1, 1);
    const searchEndDate = new Date(year, month, 0);
    const limit = 5;

    const whereCondition = {
      purchase_date: {
        [Op.gte]: searchStartDate,
        [Op.lte]: searchEndDate,
      },
    };

    if (cursor) {
      lastReceiptDate = new Date(cursor);
      whereCondition.purchase_date[Op.gt] = lastReceiptDate;
    }

    const foundReceipts = await Receipt.findAll({
      where: whereCondition,
      order: [["purchase_date", "DESC"]],
      attributes: ["id", "purchase_location", "purchase_date", "total_price"],
      limit: limit + 1,
    });

    const hasNextPage = foundReceipts.length === limit + 1;
    const nextCursor = hasNextPage
      ? foundReceipts[limit - 1].purchase_date.toISOString()
      : null;

    if (hasNextPage) foundReceipts.pop();

    return res.json({
      receipts: foundReceipts,
      nextCursor: nextCursor,
    });
  }

  //영수증 상세
  static async getReceipt(req, res, next) {
    try {
      const receiptInfo = await Receipt.findOne({
        where: {
          id: req.params.receipt_id,
        },
      });
      const receipt_items = await PurchasedFood.findAll({
        where: {
          receipt_id: req.params.receipt_id,
        },
      });

      const receiptItemsWithFoodName = await Promise.all(
        receipt_items.map(async (item) => {
          const food = await Food.findOne({
            where: { id: item.food_id },
          });
          return {
            ...item.dataValues,
            food_name: food ? food.name : null,
            food_category: food ? food.category : null,
          };
        })
      );
      if (receiptInfo) {
        receiptInfo.dataValues.receipt_items = receiptItemsWithFoodName;
        res.json(receiptInfo);
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
    const { total_price, purchase_date, receipt_items } = req.body;
    const { year, month, date } = parseDateString(purchase_date);
    try {
      const transaction = await sequelize.transaction();
      const receiptData = new Receipt(
        {
          purchase_location,
          purchase_date: new Date(year, month - 1, date),
          total_price,
        },
        { transaction }
      );
      await receiptData.save();
      await Promise.all(
        receipt_items.map(async (item) => {
          const foodData = await Food.create(
            {
              name: item.food_name,
              category: item.food_category,
            },
            { transaction }
          );
          await PurchasedFood.create(
            {
              ...item,
              receipt_id: receiptData.id,
              food_id: foodData.id,
              registered: false,
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
