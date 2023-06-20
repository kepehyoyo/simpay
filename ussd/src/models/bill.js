"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bill = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const billSchema = new mongoose_1.default.Schema({
    biller: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
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
billSchema.statics.build = (attrs) => {
    return new Bill(attrs);
};
const Bill = mongoose_1.default.model('Bill', billSchema);
exports.Bill = Bill;
