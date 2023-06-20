"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCode = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const qRCodeSchema = new mongoose_1.default.Schema({
    data: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 1000,
    },
    qrCodeId: {
        type: String,
        required: true,
        unique: true,
    },
    qrCodeUrl: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 1000,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});
qRCodeSchema.statics.build = (attrs) => {
    return new QRCode(attrs);
};
const QRCode = mongoose_1.default.model('QRCode', qRCodeSchema);
exports.QRCode = QRCode;
