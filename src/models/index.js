import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

// mysql로 연결
export const sequelize = new Sequelize(
  "mysql-container",
  "user",
  process.env.DOCKERMYSQL_PASSWORD,
  {
    dialect: "mysql",
    host: "mysql",
    define: {
      freezeTableName: true,
    },
  }
);

//연결후 결과 확인
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection successfully!");
  })
  .catch((err) => console.log("Error connecting to database", err));

console.log("Another task.");
