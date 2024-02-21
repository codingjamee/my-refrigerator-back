import { UserModel } from "../models/UserModel.js";

class UserController {
  static async getUser({ userId }) {
    return UserModel.findOne({ where: { userId } });
  }
}

export { UserController };
