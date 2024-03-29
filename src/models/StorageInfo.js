import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

const StorageInfo = sequelize.define("storage_info", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  storage_id: {
    type: DataTypes.INTEGER,
    // references: {
    //   model: "storage",
    //   key: "id",
    // },
  },
  method: {
    type: DataTypes.ENUM,
    values: ["refrigerated", "frozen", "room_temp"],
    defaultValue: "refrigerated",
  },
  remaining_amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  remaining_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  update_at: {
    type: DataTypes.TIME,
    allowNull: false,
  },
});

export default StorageInfo;
