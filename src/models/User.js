import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const User = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING(255),
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
});

User.beforeCreate((user, options) => {
  user.password = hashPassword(user.password);
});
