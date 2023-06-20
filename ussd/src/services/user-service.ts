
import { UserDoc } from "../models/user";
import { User } from "../models/user";

class UserService {
  async getUser(phoneNumber: string): Promise<UserDoc | null> {
    try {
      const user = await User.findOne({ phoneNumber }).exec();
      return user;
    } catch (error) {
      console.error(`Error getting user with phone number ${phoneNumber}: ${error}`);
      return null;
    }
  }

  async createUser(user: UserDoc): Promise<boolean> {
    try {
      await User.create(user);
      return true;
    } catch (error) {
      console.error(`Error creating user with phone number ${user.phoneNumber}: ${error}`);
      return false;
    }
  }

  async authenticateUser(phoneNumber: string, password: string): Promise<boolean> {
    try {
      const user = await User.findOne({ phoneNumber }).exec();
      if (user && user.password === password) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(`Error authenticating user with phone number ${phoneNumber}: ${error}`);
      return false;
    }
  }
}

export default UserService;
