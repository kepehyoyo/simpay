"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.TransactionStatus = exports.TransactionType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "deposit";
    TransactionType["WITHDRAWAL"] = "withdrawal";
    TransactionType["TRANSFER"] = "transfer";
    TransactionType["BILL_PAYMENT"] = "bill-payment";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["SUCCESSFUL"] = "successful";
    TransactionStatus["FAILED"] = "failed";
})(TransactionStatus = exports.TransactionStatus || (exports.TransactionStatus = {}));
const transactionSchema = new mongoose_1.default.Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(TransactionType),
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    fees: {
        type: Number,
        required: true,
        default: 0,
    },
    status: {
        type: String,
        enum: Object.values(TransactionStatus),
        required: true,
        default: TransactionStatus.PENDING,
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
transactionSchema.statics.build = (attrs) => {
    return new Transaction(attrs);
};
const Transaction = mongoose_1.default.model('Transaction', transactionSchema);
exports.Transaction = Transaction;
