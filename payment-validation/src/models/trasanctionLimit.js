"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionLimit = exports.VerificationLevel = exports.AccountType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var AccountType;
(function (AccountType) {
    AccountType["CUSTOMER"] = "CUSTOMER";
    AccountType["MERCHANT"] = "MERCHANT";
})(AccountType = exports.AccountType || (exports.AccountType = {}));
var VerificationLevel;
(function (VerificationLevel) {
    VerificationLevel[VerificationLevel["LEVEL_1"] = 1] = "LEVEL_1";
    VerificationLevel[VerificationLevel["LEVEL_2"] = 2] = "LEVEL_2";
    VerificationLevel[VerificationLevel["LEVEL_3"] = 3] = "LEVEL_3";
})(VerificationLevel = exports.VerificationLevel || (exports.VerificationLevel = {}));
const transactionLimitSchema = new mongoose_1.default.Schema({
    accountType: { type: String, required: true },
    verificationLevel: { type: Number, required: true },
    dailyLimit: { type: Number, required: true },
    weeklyLimit: { type: Number, required: true },
    monthlyLimit: { type: Number, required: true },
});
transactionLimitSchema.statics.build = (attrs) => {
    return new TransactionLimit(attrs);
};
const TransactionLimit = mongoose_1.default.model('TransactionLimit', transactionLimitSchema);
exports.TransactionLimit = TransactionLimit;
