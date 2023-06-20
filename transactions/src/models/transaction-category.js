"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionCategory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const transactionCategorySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
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
transactionCategorySchema.statics.build = (attrs) => {
    return new TransactionCategory(attrs);
};
const TransactionCategory = mongoose_1.default.model('TransactionCategory', transactionCategorySchema);
exports.TransactionCategory = TransactionCategory;
