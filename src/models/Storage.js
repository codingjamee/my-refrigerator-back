import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";
import "./modelRelations.js";

export const Storage = sequelize.define("storage", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
  },
});
