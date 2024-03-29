import { User } from "../models/User.js";
import { v4 } from "uuid";

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
    const { email, password } = req.body;
    try {
      const foundUser = User.findOne({
        where: { id: email, password },
        attributes: ["name", "email", "image_url"],
      });
      return res.status(200).json("signin success!!");
    } catch (err) {
      console.log(err);
      return res.status(500).json("cannot get user!");
    }
  }
}

export { UserController };
