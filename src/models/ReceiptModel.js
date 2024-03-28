import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const ReceiptModel = sequelize.define(
  "receiptModel",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    purchase_location: {
      type: DataTypes.STRING(50),
    },
    purchase_date: {
      type: DataTypes.STRING,
    },
    total_price: {
      type: DataTypes.INTEGER,
    },
  },
  {
    indexes: [{ fields: ["purchase_date"] }],
  }
);
