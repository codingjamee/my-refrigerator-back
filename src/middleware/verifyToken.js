import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const { JWT_SECRET } = process.env;
  const token = req.cookies["token"];
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res
      .status(400)
      .clearCookie("token")
      .json({ message: "토큰이 유효하지 않습니다." });
  }
};
