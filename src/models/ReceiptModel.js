import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const ReceiptModel = sequelize.define("receiptModel", {
  receiptId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  purchasedLocation: {
    type: DataTypes.STRING(50),
  },
  purchasedDate: {
    type: DataTypes.INTEGER,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
  },
  registered: {
    type: DataTypes.BOOLEAN,
  },
});
PurchaseReceiptItem.belongsTo(Receipt, { foreignKey: "receiptId" });
Receipt.hasMany(PurchaseReceiptItem, { foreignKey: "receiptId" });
