"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.USSDSession = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const USSDSessionSchema = new mongoose_1.default.Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    menu: {
        type: String,
        required: true,
    },
    selection: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        default: {},
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    },
    timestamps: true
});
USSDSessionSchema.statics.build = (attrs) => {
    return new USSDSession(attrs);
};
const USSDSession = mongoose_1.default.model('USSDSession', USSDSessionSchema);
exports.USSDSession = USSDSession;
