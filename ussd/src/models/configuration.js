"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const configurationSchema = new mongoose_1.default.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: mongoose_1.default.Schema.Types.Mixed,
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
configurationSchema.statics.build = (attrs) => {
    return new Configuration(attrs);
};
const Configuration = mongoose_1.default.model('Configuration', configurationSchema);
exports.Configuration = Configuration;
