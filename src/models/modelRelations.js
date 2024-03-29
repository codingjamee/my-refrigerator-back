import { User } from "./User.js";
import { Food } from "./Food.js";
import { Receipt } from "./Receipt.js";
import { Storage } from "./Storage.js";
import { PurchasedFood } from "./PurchasedFood.js";
import StorageInfo from "./StorageInfo.js";

User.hasMany(Receipt, {
  foreignKey: "user_id",
});
User.hasMany(PurchasedFood, {
  foreignKey: "user_id",
});
User.hasMany(Storage, {
  foreignKey: "user_id",
});

Receipt.belongsTo(User, { foreignKey: "user_id" });
Receipt.hasMany(PurchasedFood, { foreignKey: "receipt_id" });

PurchasedFood.belongsTo(User, {
  foreignKey: "user_id",
});
PurchasedFood.belongsTo(Receipt, {
  foreignKey: "receipt_id",
});
PurchasedFood.belongsTo(StorageInfo, { foreignKey: "storage_info_id" });
PurchasedFood.belongsTo(Food, { foreignKey: "food_id" });

Food.hasMany(PurchasedFood, {
  foreignKey: "food_id",
});

Storage.hasMany(StorageInfo, {
  foreignKey: "storage_id",
});
Storage.belongsTo(User, {
  foreignKey: "user_id",
});

StorageInfo.hasMany(PurchasedFood, { foreignKey: "storage_info_id" });
StorageInfo.belongsTo(Storage, { foreignKey: "storage_id" });
