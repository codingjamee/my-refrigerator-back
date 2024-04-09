import { User } from "../models/User.js";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class UserController {
  static async signupUser(req, res, next) {
    const { name, email, password, image_url } = req.body;
    try {
      await User.create({
        id: v4(),
        name,
        email,
        password,
        image_url,
      });
      return res.status(201).json({ id: req.email, text: "signup success!!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json("cannot signup user!");
    }
  }
  static async loginUser(req, res, next) {
    const JWT_SECRET = process.env.JWT_SECRET;
    const { email, password } = req.body;
    try {
      const foundUser = await User.findOne({
        where: { email: email },
        attributes: ["name", "email", "image_url", "password"],
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
      return res
        .status(200)
        .json({ id: foundUser.email, text: "signin success!!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json("cannot get user!");
    }
  }
}

export { UserController };
