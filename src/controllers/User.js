import { UserModel } from "../models/Users.js";

class UserController {
  static async getUser({ user_id }) {
    return UserModel.findOne({ user_id });
  }
}

export { UserController };
