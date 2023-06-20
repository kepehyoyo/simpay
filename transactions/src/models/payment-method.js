"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paymentMethodSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['mobile_money', 'card', 'bank_account', 'wallet'],
        required: true,
    },
    cardBrand: {
        type: String,
    },
    last4Digits: {
        type: String,
    },
    bankName: {
        type: String,
    },
    bankAccountType: {
        type: String,
    },
    bankRoutingNumber: {
        type: String,
    },
    bankAccountNumber: {
        type: String,
    },
    walletId: {
        type: String,
    },
    mobileMoneyProvider: {
        type: String,
    },
    mobileMoneyNumber: {
        type: String,
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
paymentMethodSchema.statics.build = (attrs) => {
    return new PaymentMethod(attrs);
};
const PaymentMethod = mongoose_1.default.model('PaymentMethod', paymentMethodSchema);
exports.PaymentMethod = PaymentMethod;
