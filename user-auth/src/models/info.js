"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Info = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const infoSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
        default: null,
    },
    lastName: {
        type: String,
        required: true,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
infoSchema.statics.build = (attrs) => {
    return new Info(attrs);
};
const Info = mongoose_1.default.model('Info', infoSchema);
exports.Info = Info;
