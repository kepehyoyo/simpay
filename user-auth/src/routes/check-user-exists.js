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
exports.checkUserExistsRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const user_1 = require("../models/user");
const info_1 = require("../models/info");
const common_v2_1 = require("@cygnetops/common-v2");
const router = express_1.default.Router();
exports.checkUserExistsRouter = router;
router.get("/api/user-auth/check-exists", [
    (0, express_validator_1.check)("phoneNumber").isNumeric().withMessage("PhoneNumber must be valid"),
], common_v2_1.validateRequest, 
// check('phoneNumber').isMobilePhone('any', { strictMode: true }).withMessage('Invalid phone number'),
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber } = req.query;
    console.log("jkjhgfdf");
    try {
        const existingUser = yield user_1.User.findOne({ phoneNumber });
        if (existingUser) {
            console.log("user exists");
            const userInfo = yield info_1.Info.findOne({ userId: existingUser.userId });
            return res.status(200).json({ user: userInfo });
        }
        else {
            console.log("user does not exist");
            return res.sendStatus(404);
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
}));
