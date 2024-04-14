import { sequelize } from "./index.js";
import { DataTypes } from "sequelize";

export const Food = sequelize.define("food", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(50),
  },
});
