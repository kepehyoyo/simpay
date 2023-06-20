"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactInfo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const contactInfoSchema = new mongoose_1.default.Schema({
    ContactInfoId: { type: mongoose_1.default.Types.ObjectId, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
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
contactInfoSchema.statics.build = (attrs) => {
    return new ContactInfo(attrs);
};
const ContactInfo = mongoose_1.default.model('ContactInfo', contactInfoSchema);
exports.ContactInfo = ContactInfo;
