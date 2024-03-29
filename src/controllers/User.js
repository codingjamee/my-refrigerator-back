import { User } from "../models/User.js";

class UserController {
  static async getUser({ userId }) {
    return User.findOne({ where: { userId } });
  }
}

export { UserController };
