"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutMe = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const aboutMeSchema = new mongoose_1.default.Schema({
    AboutMeId: { type: mongoose_1.default.Types.ObjectId, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            ;
            delete ret.__v;
        }
    }
});
aboutMeSchema.statics.build = (attrs) => {
    return new AboutMe(attrs);
};
const AboutMe = mongoose_1.default.model('AboutMe', aboutMeSchema);
exports.AboutMe = AboutMe;
