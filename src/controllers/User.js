import { User } from "../models/User.js";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";

class UserController {
  static async signupUser(req, res, next) {
    const { name, email, password } = req.body;
    try {
      await User.create({
        id: v4(),
        name,
        email,
        password,
      });
      return res.status(201).json("signup success!!");
    } catch (err) {
      console.log(err);
      return res.status(500).json("cannot signup user!");
    }
  }
  static async loginUser(req, res, next) {
    const JWT_SECRET = process.env.JWT_SECRET;
    const { email, password } = req.body;
    try {
      const foundUser = User.findOne({
        where: { id: email },
        attributes: ["name", "email", "image_url"],
      });
      if (!foundUser) {
        return res
          .status(401)
          .json("이메일 혹은 비밀번호가 일치하지 않습니다!");
      }
      const isValidPassword = await bcrypt.compare(
        password,
        foundUser.password
      );
      if (!isValidPassword) {
        return res
          .status(401)
          .json("이메일 혹은 비밀번호가 일치하지 않습니다!");
      }
      const token = jwt.sign({ id: foundUser.email }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true });
      return res.status(200).json("signin success!!");
    } catch (err) {
      console.log(err);
      return res.status(500).json("cannot get user!");
    }
  }
}

export { UserController };
