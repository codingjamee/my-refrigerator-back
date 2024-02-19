import { sequelize } from "./index.js";
import { DataTypes } from "sequelize";

export const StoredFoodModel = sequelize.define("storedFood", {
  foodId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  storageMethod: {
    type: DataTypes.ENUM("refrigerated", "frozen", "ambient"),
  },
  foodName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  foodImageUrl: {
    type: DataTypes.STRING(100),
  },
  foodAmount: {
    type: DataTypes.SMALLINT,
  },
  expirationDate: {
    type: DataTypes.DATE,
  },
  purchasedDate: {
    type: DataTypes.DATE,
  },
  purchasedPrice: {
    type: DataTypes.DATE,
  },
});
