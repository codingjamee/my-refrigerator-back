import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

const Storage = sequelize.define("storage", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.UUID,
  },
});

export default Storage;
