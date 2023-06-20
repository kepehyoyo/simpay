"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillPayment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const billPaymentSchema = new mongoose_1.default.Schema({
    billId: {
        type: String,
        required: true,
    },
    BillPaymentId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        required: true,
        default: 'PENDING',
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now,
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
billPaymentSchema.statics.build = (attrs) => {
    return new BillPayment(attrs);
};
const BillPayment = mongoose_1.default.model('BillPayment', billPaymentSchema);
exports.BillPayment = BillPayment;
