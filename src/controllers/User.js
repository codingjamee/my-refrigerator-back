import { User } from "../models/User.js";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { verifyToken } from "../middleware/verifyToken.js";

class UserController {
  static async signupUser(req, res, next) {
    const { name, email, password } = req.body;
    const data = {
      id: v4(),
      name,
      email,
      password,
    };
    if (req.body.image_url) {
      data.image_url = req.body.image_url;
    }
    try {
      await User.create(data);
      return res
        .status(201)
        .json({ ok: true, email: email, text: "signup success!!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json("cannot signup user!");
    }
  }
  static async loginUser(req, res, next) {
    const { email, password } = req.body;
    const { JWT_SECRET } = process.env;
    try {
      const foundUser = await User.findOne({
        where: { email: email },
        attributes: ["name", "email", "image_url", "password"],
      });
      if (!foundUser) {
        return res
          .status(401)
          .json({ message: "이메일 혹은 비밀번호가 일치하지 않습니다!" });
      }
      const isValidPassword = await bcrypt.compare(
        password,
        foundUser.password
      );
      if (!isValidPassword) {
        return res
          .status(401)
          .json({ message: "이메일 혹은 비밀번호가 일치하지 않습니다!" });
      }
      const token = jwt.sign({ id: foundUser.email }, JWT_SECRET, {
        expiresIn: "1h",
      });
      return res
        .cookie("token", token, { httpOnly: true })
        .status(200)
        .json({
          ok: true,
          username: foundUser.name,
          image: foundUser.image_url || "",
          text: "signin success!!",
        });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "cannot get user!" });
    }
  }

  static async logoutUser(req, res, next) {
    return res
      .clearCookie("token")
      .json({ ok: true, message: "성공적으로 로그아웃하였습니다." });
  }
  static async userInfo(req, res, next) {
    console.log(req.user);
    const email = req.user.id;
    const foundUser = await User.findOne({
      where: { email: email },
      attributes: ["name", "email", "image_url", "password"],
    });
    return res.json({
      ok: true,
      name: foundUser.name,
      image: foundUser.image_url || "",
      text: "signin success!!",
    });
  }
}

export { UserController };
