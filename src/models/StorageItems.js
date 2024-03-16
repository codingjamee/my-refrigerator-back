import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const StorageItems = sequelize.define("storage_items", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  storage_id: { type: DataTypes.INTEGER },
  food_id: {
    type: DataTypes.INTEGER,
  },
  method: {
    type: DataTypes.ENUM("refrigerated", "frozen", "ambient"),
  },
  amount: {
    type: DataTypes.INTEGER,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  iamge_url: {
    type: DataTypes.STRING(255),
  },
  expiry_date: {
    type: DataTypes.DATE,
  },
});
