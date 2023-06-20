import { UserDoc, User } from "../models/user";

export class UserService {
  
  static async getUserById(userId: string): Promise<UserDoc | undefined> {
    const existingUser = await User.findOne({ userId });
    if (existingUser === null) {
      return undefined;
    }
    return existingUser;
  }
}
