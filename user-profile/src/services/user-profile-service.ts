import { BadRequestError } from "@cygnetops/common-v2";
import { UserProfile, UserProfileAttrs } from "../models/profile";

class UserProfileService {
  async createProfile(
    userId: string,
    phoneNumber: string,
    firstName: string,
    lastName: string,
    middleName?: string,
    avatar?: string,
    coverPhoto?: string,
    aboutMe?: string,
    contactInfo?: string
  ) {
    // Create a new user profile
    const userProfileAttrs: UserProfileAttrs = {
      userId,
      firstName,
      lastName,
      phoneNumber,
      middleName,
      avatar,
      coverPhoto,
      aboutMe,
      contactInfo,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const existingUser = await UserProfile.findOne({ userId });

    if (existingUser) {
      throw new BadRequestError("User already exists");
    }
   
    const userProfile = UserProfile.build(userProfileAttrs);
    try {
      await userProfile.save(); 

      return userProfile;
    } catch (err) {
      console.error("Error Creating User Profile", err);
      throw new Error("Server error");
    }
  }

  async getUserProfile(userId:string) {
    try {
      const userProfile = await UserProfile.findOne({ userId });
      return userProfile;
    } catch (err) {
      throw new Error("Error retrieving user profile");
    }
  }
  async updateUserProfile(userId: string, updatedProfile: UserProfileAttrs) {
    try {
      const userProfile = await UserProfile.findOneAndUpdate(
        { userId },
        { $set: updatedProfile },
        { new: true }
      );

      if (!userProfile) {
        throw new Error("User profile not found");
      }

      return userProfile;
    } catch (err) {
      throw new Error("Error updating user profile");
    }
  }

}


export { UserProfileService };
