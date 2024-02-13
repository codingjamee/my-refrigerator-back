import { Sequelize } from "sequelize";
import "dotenv/config";
//mysql로 연결
const sequelize = new Sequelize(
  "my-refrigerator",
  "root",
  process.env.MYSQLPASSWORD,
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

export { sequelize };
