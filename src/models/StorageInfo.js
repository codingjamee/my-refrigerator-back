const StorageInfo = sequelize.define("storage_info", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  storage_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "storage",
      key: "id",
    },
  },
  method: {
    type: DataTypes.ENUM,
    values: ["refrigerated", "frozen", "room_temp"],
    allowNull: false,
  },
  remaining_amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  remaining_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  update_at: {
    type: DataTypes.TIMESTAMP,
    allowNull: false,
  },
});

export default StorageInfo;
