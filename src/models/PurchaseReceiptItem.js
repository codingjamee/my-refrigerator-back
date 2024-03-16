import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const PurchaseReceiptItem = sequelize.define("purchase_receipt_item", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  storage_id: {
    type: DataTypes.INTEGER,
  },
  receipt_id: {
    type: DataTypes.INTEGER,
  },
  food_id: {
    type: DataTypes.INTEGER,
  },
  method: {
    type: DataTypes.ENUM,
  },
  amount: {
    type: DataTypes.INTEGER,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  remain_amount: {
    type: DataTypes.INTEGER,
  },
  image_url: {
    type: DataTypes.STRING(255),
  },
  purchase_price: {
    type: DataTypes.INTEGER,
  },
  expiry_date:{
    type: DataTypes.DATE
  },
  registered: {
    type: DataTypes.BOOLEAN,
  },
});
