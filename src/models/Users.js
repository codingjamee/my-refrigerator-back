import { DataTypes } from "sequelize";
import { sequelize } from "../db/connect.js";

//create model represent new table
export const UserModel = sequelize.define("user", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
  },
  password: {
    type: DataTypes.STRING(200),
  },
});
