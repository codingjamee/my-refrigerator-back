import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";
import { StoredFoodModel } from "./StoredFoodModel.js";
import { ReceiptModel } from "./ReceiptModel.js";

//create model represent new table
export const UserModel = sequelize.define("user", {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  profileImageUrl: {
    type: DataTypes.STRING(100),
  },
  email: {
    type: DataTypes.STRING(100),
  },
  password: {
    type: DataTypes.STRING(200),
  },
});

UserModel.hasMany(StoredFoodModel, {
  foreignKey: "userId",
});
UserModel.hasMany(ReceiptModel);
StoredFoodModel.hasOne(UserModel);
