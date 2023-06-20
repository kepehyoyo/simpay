"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoverPhoto = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const coverPhotoSchema = new mongoose_1.default.Schema({
    CoverPhotoId: { type: mongoose_1.default.Types.ObjectId, required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});
coverPhotoSchema.statics.build = (attrs) => {
    return new CoverPhoto(attrs);
};
const CoverPhoto = mongoose_1.default.model('CoverPhoto', coverPhotoSchema);
exports.CoverPhoto = CoverPhoto;
