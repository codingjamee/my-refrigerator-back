import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
import "./modelRelations";
dotenv.config();

// mysql로 연결
export const sequelize = new Sequelize(
  "mysql-container",
  "user",
  process.env.DOCKERMYSQL_PASSWORD,
  {
    dialect: "mysql",
    timezone: "asia/seoul", // created_at 등 저장할때 한국시간으로 저장
    host: "mysql",
    define: {
      freezeTableName: true,
    },
    dialectOptions: {
      charset: "utf8mb4",
      dateStrings: true, // 적용 db에서 꺼내올때 바로 스트링 처리
      typeCast: true, // date -> 스트링
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
