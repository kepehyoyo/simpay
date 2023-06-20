"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const body_parser_1 = require("body-parser");
const cookie_session_1 = __importDefault(require("cookie-session"));
const common_v2_1 = require("@cygnetops/common-v2");
const verify_phone_number_1 = require("./routes/verify-phone-number");
const resend_code_1 = require("./routes/resend-code");
const verify_code_1 = require("./routes/verify-code");
const signup_1 = require("./routes/signup");
const check_user_exists_1 = require("./routes/check-user-exists");
const verify_passcode_1 = require("./routes/verify-passcode");
const passport_1 = __importDefault(require("passport"));
const app = (0, express_1.default)();
exports.app = app;
app.set("trust proxy", true);
app.use((0, body_parser_1.json)());
app.use(passport_1.default.initialize());
app.use((0, cookie_session_1.default)({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
}));
app.use(common_v2_1.currentUser);
app.use(verify_passcode_1.verifyPassCodeRouter);
app.use(check_user_exists_1.checkUserExistsRouter);
app.use(verify_phone_number_1.verifyPhoneNumberRouter);
app.use(resend_code_1.resendCodeRouter);
app.use(verify_code_1.verifyCodeRouter);
app.use(signup_1.signupRouter);
app.all("*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    throw new common_v2_1.NotFoundError();
}));
app.use(common_v2_1.errorHandler);
