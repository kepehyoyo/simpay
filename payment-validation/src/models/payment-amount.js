"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentAmount = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paymentAmountSchema = new mongoose_1.default.Schema({
    walletId: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});
paymentAmountSchema.statics.build = (attrs) => {
    return new PaymentAmount(attrs);
};
const PaymentAmount = mongoose_1.default.model('PaymentAmount', paymentAmountSchema);
exports.PaymentAmount = PaymentAmount;
