import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";
import "./modelRelations.js";

export const StorageModel = sequelize.define("storage", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
  },
});
