import { ReceiptModel } from "../models/ReceiptModel.js";
import { FoodModel } from "../models/FoodModel.js";
import { PurchaseReceiptItem } from "../models/PurchaseReceiptItem.js";
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

    const foundReceipts = await ReceiptModel.findAll({
      where: whereCondition,
      order: [["purchase_date", "ASC"]],
      limit: limit + 1,
    });

    const hasNextPage = foundReceipts.length === limit + 1;
    const nextCursor = hasNextPage
      ? foundReceipts[limit - 1].purchase_date.toISOString()
      : null;

    if (hasNextPage) foundReceipts.pop();

    const receiptItemCount = await Promise.all(
      foundReceipts.map(async (receipt) => {
        return await PurchaseReceiptItem.count({
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
    try {
      const receiptInfo = await ReceiptModel.findOne({
        where: {
          id: req.params.receipt_id,
        },
      });
      const receipt_items = await PurchaseReceiptItem.findAll({
        where: {
          receipt_id: req.params.receipt_id,
        },
      });

      const receiptItemsWithFoodName = await Promise.all(
        (receiptInfo.dataValues.receipt_items = receipt_items.map(
          async (item) => {
            const food = await FoodModel.findOne({
              where: { id: item.food_id },
            });
            return {
              ...item.dataValues,
              food_name: food ? food.name : null,
              food_category: food ? food.category : null,
            };
          }
        ))
      );
      if (receiptInfo) {
        receiptInfo.dataValues.receipt_items = receiptItemsWithFoodName;
        res.json(receiptInfo);
      } else {
        res.status(404).send("Receipt not found!");
      }
    } catch (err) {
      console.log(err);
      // next(err)
      res.status(500).send("cannot get receipt data!");
    }
  }

  static async postReceipt(req, res, next) {
    const { total_price, purchase_date, receipt_items } = req.body;
    const { year, month, date } = parseDateString(purchase_date);
    try {
      const transaction = await sequelize.transaction();
      const receiptData = new ReceiptModel(
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
          const foodData = await FoodModel.create(
            {
              name: item.food_name,
              category: item.food_category,
            },
            { transaction }
          );
          await PurchaseReceiptItem.create(
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
      res.status(201).json({
        message: "영수증 저장이 정상적으로 처리되었습니다.",
        receipt_id: receiptData.id,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("cannot post receipt data!");
      // next(err)
    }
  }
}
