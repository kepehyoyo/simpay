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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_v2_1 = require("@cygnetops/common-v2");
;
const user_profile_service_1 = require("../services/user-profile-service");
const router = express_1.default.Router();
exports.getUserProfileRouter = router;
const userProfileService = new user_profile_service_1.UserProfileService();
router.get("/api/user-profile/users/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    console.log(userId);
    try {
        const userProfile = yield userProfileService.getUserProfile(userId);
        if (!userProfile) {
            throw new common_v2_1.BadRequestError("User profile not found");
        }
        res.status(200).json({ userId: userProfile.userId, firstName: userProfile.firstName, middleName: userProfile.middleName, lastName: userProfile.lastName, phone: userProfile.phoneNumber });
    }
    catch (err) {
        console.error("Error Fetching User Profile", err);
        res.status(500).json({ message: "Server error" });
    }
}));
