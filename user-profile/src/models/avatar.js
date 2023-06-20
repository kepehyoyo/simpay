"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avatar = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const avatarSchema = new mongoose_1.default.Schema({
    AvatarId: { type: mongoose_1.default.Types.ObjectId, required: true },
    imageUrl: { type: String, required: true },
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
avatarSchema.statics.build = (attrs) => {
    return new Avatar(attrs);
};
const Avatar = mongoose_1.default.model('Avatar', avatarSchema);
exports.Avatar = Avatar;
