import { UserModel } from "./UserModel";
import { FoodModel } from "./FoodModel";
import { ReceiptModel } from "./ReceiptModel";
import { StorageModel } from "./StorageModel";
import { StorageItems } from "./StorageItems";
import { PurchaseReceiptItem } from "./PurchaseReceiptItem";

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
UserModel.hasMany(StorageModel, {
  foreignKey: "user_id",
});
StorageModel.belongsTo(UserModel, {
  foreignKey: "user_id",
});
StorageModel.hasMany(StorageItems, { foreignKey: "storage_id" });
StorageItems.belongsTo(FoodModel, { foreignKey: "food_id" });
FoodModel.hasMany(StorageItems, { foreignKey: "food_id" });
StorageItems.belongsTo(StorageModel, { foreignKey: "storage_id" });
