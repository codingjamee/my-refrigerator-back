import { UserModel } from "./UserModel.js";
import { FoodModel } from "./FoodModel.js";
import { ReceiptModel } from "./ReceiptModel.js";
import { StorageModel } from "./StorageModel.js";
import { PurchaseReceiptItem } from "./PurchaseReceiptItem.js";

UserModel.hasMany(ReceiptModel, {
  foreignKey: "user_id",
});
ReceiptModel.belongsTo(UserModel, { foreignKey: "user_id" });
ReceiptModel.hasMany(PurchaseReceiptItem, { foreignKey: "receipt_id" });
PurchaseReceiptItem.belongsTo(ReceiptModel, {
  foreignKey: "receipt_id",
});
PurchaseReceiptItem.belongsTo(FoodModel, { foreignKey: "food_id" });
FoodModel.hasMany(PurchaseReceiptItem, {
  foreignKey: "food_id",
});
StorageModel.hasMany(PurchaseReceiptItem, { foreignKey: "storage_id" });
PurchaseReceiptItem.belongsTo(StorageModel, { foreignKey: "storage_id" });
UserModel.hasMany(StorageModel, {
  foreignKey: "user_id",
});
StorageModel.belongsTo(UserModel, {
  foreignKey: "user_id",
});
