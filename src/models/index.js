import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

// mysql로 연결
export const sequelize = new Sequelize(
  "mysql-container",
  "user",
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: "mysql",
    timezone: "+09:00", //한국시간대 설정
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
