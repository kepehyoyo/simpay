"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = exports.Transaction = exports.TransactionStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var TransactionType;
(function (TransactionType) {
    TransactionType["DEBIT"] = "debit";
    TransactionType["CREDIT"] = "credit";
    TransactionType["TRANSFER"] = "transfer";
})(TransactionType || (TransactionType = {}));
exports.TransactionType = TransactionType;
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["INITIATED"] = "initiated";
    TransactionStatus["VALIDATED"] = "validated";
    TransactionStatus["AUTHORIZED"] = "authorized";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["SUCCESS"] = "success";
    TransactionStatus["APPROVED"] = "approved";
    TransactionStatus["FAILURE"] = "failure";
    TransactionStatus["SUCCESSFUL"] = "successful";
    TransactionStatus["REJECTED"] = "rejected";
    TransactionStatus["FAILED"] = "failed";
})(TransactionStatus = exports.TransactionStatus || (exports.TransactionStatus = {}));
const transactionSchema = new mongoose_1.default.Schema({
    transactionId: { type: String, required: true, unique: true, },
    sourceWalletId: { type: String, required: true, },
    destinationWalletId: { type: String, required: true, },
    transactionType: { type: String, required: true, enum: Object.values(TransactionType), },
    transactionAmount: { type: Number, required: true, },
    transactionCurrency: { type: String, required: true, },
    transactionFee: { type: Number, required: true, },
    transactionStatus: { type: String, required: true, enum: Object.values(TransactionStatus), },
    transactionDate: { type: Date, required: true, default: Date.now },
    transactionDescription: { type: String, required: true, },
    metadata: { type: Object, required: false, },
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
