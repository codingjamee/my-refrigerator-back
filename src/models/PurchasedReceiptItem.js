import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const PurchasedReceiptItem = sequelize.define(
  "PurchasedReceiptItemModel",
  {
    foodName: {
      type: DataTypes.STRING(100),
    },
    purchasedPlace: {
      type: DataTypes.STRING(50),
    },
    foodWeight: {
      type: DataTypes.INTEGER,
    },
    purchasedPrice: {
      type: DataTypes.INTEGER,
    },
    pricePerAmount: {
      type: DataTypes.INTEGER,
    },
  }
);
