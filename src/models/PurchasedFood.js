import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const PurchasedFood = sequelize.define(
  "purchased_food",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
    },
    storage_info_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "storage_info",
        key: "id",
      },
    },
    receipt_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "receipt",
        key: "id",
      },
    },
    food_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "food",
        key: "id",
      },
    },
    purchase_item_id: {
      type: DataTypes.INTEGER,
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    image_url: {
      type: DataTypes.STRING(255),
    },
    purchase_price: {
      type: DataTypes.INTEGER,
    },
    expiry_date: {
      type: DataTypes.DATE,
    },
    registered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    indexes: [{ fields: ["expiry_date"] }, { fields: ["purchase_price"] }],
  }
);
