import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

const StorageInfo = sequelize.define("storage_info", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  storage_id: {
    type: DataTypes.INTEGER,
  },
  method: {
    type: DataTypes.ENUM,
    values: ["refrigerated", "frozen", "roomTemp"],
    defaultValue: "roomTemp",
  },
  remaining_amount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  remaining_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});

export default StorageInfo;
