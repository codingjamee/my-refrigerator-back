import { DataTypes } from "sequelize";
import { sequelize } from "./index";

export const StorageModel = sequelize.define("storage", {
  id: {
    type: DataTypes.INTEGER,
  },
  user_id: {
    type: DataTypes.UUID,
  },
});
