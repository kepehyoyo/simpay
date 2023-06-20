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
exports.verifyCodeRouter = void 0;
const express_1 = __importDefault(require("express"));
//import { ensureLoggedIn } from 'connect-ensure-login';
const twilio_1 = __importDefault(require("twilio"));
//import logger from '../../logger';
//const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env;
const TWILIO_ACCOUNT_SID = "AC60101d43434ad308527ebbd6850966e9";
const TWILIO_AUTH_TOKEN = "63dd5bf3f685cc065378a4e140cedc6b";
const VERIFICATION_SID = "VA74fdf3392050a83ce8f5a9aa1782ef64";
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !VERIFICATION_SID) {
    console.error('Twilio credentials and service SID not set in environment variables.');
    process.exit(1);
}
const router = express_1.default.Router();
exports.verifyCodeRouter = router;
router.post('/api/user-auth/verify-code', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { phoneNumber,code } = req.body;
    try {
        const { phoneNumber, code } = req.body;
        const verifyphoneNumber = `+${phoneNumber}`;
        console.log(verifyphoneNumber);
        const client = (0, twilio_1.default)(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
        const verificationCheck = yield client.verify
            .v2.services(VERIFICATION_SID)
            .verificationChecks.create({ to: verifyphoneNumber, code });
        if (verificationCheck.status === 'approved') {
            res.status(200).json({ message: 'Verification successful' });
        }
        else {
            res.status(400).json({ message: 'Invalid verification code' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
