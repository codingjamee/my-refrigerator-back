import { sequelize } from "./index.js";
import { DataTypes } from "sequelize";

export const FoodModel = sequelize.define("food", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(50),
  },
});
