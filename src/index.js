import * as dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";

const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, () => {
  console.log(`정상적으로 서버를 시작하였습니다.  http://localhost:${PORT}`);
});
