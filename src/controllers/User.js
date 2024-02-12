import { UserModel } from "../models/Users.js";

class UserController {
  static async getUser({ user_id }) {
    return UserModel.findOne({ where: { user_id } });
  }
}

export { UserController };
