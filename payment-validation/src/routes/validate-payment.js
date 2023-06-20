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
exports.validatePaymentRouter = void 0;
const express_1 = __importDefault(require("express"));
const trasanctionLimit_1 = require("../models/trasanctionLimit");
const validation_service_1 = require("../services/validation-service");
const router = express_1.default.Router();
exports.validatePaymentRouter = router;
router.post('/validate-payment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, paymentAmount, paymentRecipient, paymentMethod } = req.body;
        const accountType = trasanctionLimit_1.AccountType.CUSTOMER;
        const verificationLevel = trasanctionLimit_1.VerificationLevel.LEVEL_1;
        // perform payment validation checks
        const isPaymentValid = yield validation_service_1.ValidationService.validatePayment(userId, paymentAmount, accountType, verificationLevel, paymentRecipient, paymentMethod);
        if (isPaymentValid) {
            // payment is valid, proceed with payment authorization
            res.status(200).json({ message: 'Payment is valid.' });
        }
        else {
            // payment is not valid, reject payment request
            res.status(400).json({ message: 'Payment is not valid.' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while processing the payment.' });
    }
}));
