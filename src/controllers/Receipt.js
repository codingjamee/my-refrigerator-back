import { ReceiptModel } from "../models/ReceiptModel.js";
import { FoodModel } from "../models/FoodModel.js";
import { PurchaseReceiptItem } from "../models/PurchaseReceiptItem.js";
import { sequelize } from "../models/index.js";

export class ReceiptController {
  static async getReceipt(req, res, next) {
    try {
      const receiptInfo = await ReceiptModel.findOne({
        where: {
          id: req.params.receipt_id,
        },
      });
      const receiptItems = await PurchaseReceiptItem.findAll({
        where: {
          receipt_id: req.params.receipt_id,
        },
      });
      if (receiptInfo) {
        receiptInfo.dataValues.receiptItems = receiptItems;
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
    const { x, purchase_date, receipt_items } = req.body;
    try {
      const transaction = await sequelize.transaction();
      const receiptData = new ReceiptModel(
        {
          purchase_location,
          purchase_date,
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
