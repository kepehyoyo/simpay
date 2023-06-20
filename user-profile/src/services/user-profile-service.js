"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileService = void 0;
const common_v2_1 = require("@cygnetops/common-v2");
const profile_1 = require("../models/profile");
class UserProfileService {
    createProfile(userId, phoneNumber, firstName, lastName, middleName, avatar, coverPhoto, aboutMe, contactInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a new user profile
            const userProfileAttrs = {
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
            const existingUser = yield profile_1.UserProfile.findOne({ userId });
            if (existingUser) {
                throw new common_v2_1.BadRequestError("User already exists");
            }
            const userProfile = profile_1.UserProfile.build(userProfileAttrs);
            try {
                yield userProfile.save();
                return userProfile;
            }
            catch (err) {
                console.error("Error Creating User Profile", err);
                throw new Error("Server error");
            }
        });
    }
    getUserProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userProfile = yield profile_1.UserProfile.findOne({ userId });
                return userProfile;
            }
            catch (err) {
                throw new Error("Error retrieving user profile");
            }
        });
    }
    updateUserProfile(userId, updatedProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userProfile = yield profile_1.UserProfile.findOneAndUpdate({ userId }, { $set: updatedProfile }, { new: true });
                if (!userProfile) {
                    throw new Error("User profile not found");
                }
                return userProfile;
            }
            catch (err) {
                throw new Error("Error updating user profile");
            }
        });
    }
}
exports.UserProfileService = UserProfileService;
