"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const trasanctionLimit_1 = require("./trasanctionLimit");
const walletSchema = new mongoose_1.default.Schema({
    walletId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, required: true },
    accountType: { type: String, required: true, enum: Object.values(trasanctionLimit_1.AccountType), },
    verificationLevel: { type: String, required: true, enum: Object.values(trasanctionLimit_1.VerificationLevel), },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});
walletSchema.statics.build = (attrs) => {
    return new Wallet(attrs);
};
const Wallet = mongoose_1.default.model('Wallet', walletSchema);
exports.Wallet = Wallet;
