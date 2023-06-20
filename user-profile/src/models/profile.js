"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userProfileSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String, default: "" },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    avatar: { type: mongoose_1.default.Types.ObjectId, ref: 'Avatar' },
    coverPhoto: { type: mongoose_1.default.Types.ObjectId, ref: 'CoverPhoto' },
    aboutMe: { type: mongoose_1.default.Types.ObjectId, ref: 'AboutMe' },
    contactInfo: { type: mongoose_1.default.Types.ObjectId, ref: 'ContactInfo' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});
userProfileSchema.statics.build = (attrs) => {
    return new UserProfile(attrs);
};
const UserProfile = mongoose_1.default.model('UserProfile', userProfileSchema);
exports.UserProfile = UserProfile;
