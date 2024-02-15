import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

// mysql로 연결
const sequelize = new Sequelize(
  "mysql-container",
  "root",
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
    return sequelize.sync({ force: false });
  })
  .catch((err) => console.log("Error connecting to database", err));

console.log("Another task.");

export { sequelize };
