import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const PurchaseReceiptItem = sequelize.define(
  "PurchaseReceiptItemModel",
  {
    foodCategory: {
      type: DataTypes.STRING(50),
    },
    foodName: {
      type: DataTypes.STRING(100),
    },
    receiptId: {
      type: Sequelize.UUID,
      allowNull: true,
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
    quantity: {
      type: DataTypes.INTEGER,
    },
    registered: {
      type: DataTypes.BOOLEAN,
    },
  }
);
