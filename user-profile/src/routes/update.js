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
exports.updateUserProfileRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const common_v2_1 = require("@cygnetops/common-v2");
;
const user_profile_service_1 = require("../services/user-profile-service");
const router = express_1.default.Router();
exports.updateUserProfileRouter = router;
const userProfileService = new user_profile_service_1.UserProfileService();
router.put('/api/user-profile/users/:userId', [
    (0, express_validator_1.body)('firstName').isString().notEmpty(),
    (0, express_validator_1.body)('middleName').isString().optional(),
    (0, express_validator_1.body)('lastName').isString().notEmpty(),
    (0, express_validator_1.body)('phoneNumber').isString().notEmpty(),
    (0, express_validator_1.body)('avatar').isString().optional(),
    (0, express_validator_1.body)('coverPhoto').isString().optional(),
    (0, express_validator_1.body)('aboutMe').isString().optional(),
    (0, express_validator_1.body)('contactInfo').isString().optional(),
], common_v2_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { firstName, middleName, lastName, phoneNumber, avatar, coverPhoto, aboutMe, contactInfo, } = req.body;
    try {
        const updatedProfile = {
            userId,
            firstName,
            middleName,
            lastName,
            phoneNumber,
            avatar,
            coverPhoto,
            aboutMe,
            contactInfo,
            updatedAt: new Date(),
        };
        const userProfile = yield userProfileService.updateUserProfile(userId, updatedProfile);
        // res.status(200).send(userProfile);
        res.status(200).json({ userId: userId, firstName: firstName, middleName: middleName, lastName: lastName, phoneNumber: phoneNumber });
    }
    catch (err) {
        console.error("Error Updating User Profile", err);
        res.status(500).json({ message: "Server error" });
    }
}));
