import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const PurchaseReceiptItem = sequelize.define("purchase_receipt_item", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  receipt_id: {
    type: DataTypes.INTEGER,
  },
  food_id: {
    type: DataTypes.INTEGER,
  },
  amount: {
    type: DataTypes.INTEGER,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  purchase_price: {
    type: DataTypes.INTEGER,
  },
  registered: {
    type: DataTypes.BOOLEAN,
  },
});
