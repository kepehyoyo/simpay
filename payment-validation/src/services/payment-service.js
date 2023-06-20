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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const payment_amount_service_1 = require("./payment-amount-service");
const transaction_limit_service_1 = require("./transaction-limit-service");
const wallet_service_1 = require("./wallet-service");
class PaymentService {
    static checkPaymentAmount(walletId, paymentAmount, accountType, verificationLevel) {
        return __awaiter(this, void 0, void 0, function* () {
            //  const transactionLimitModel = new TransactionLimitModel();
            const dailyLimit = yield transaction_limit_service_1.TransactionLimitService.getDailyLimit(accountType, verificationLevel);
            const weeklyLimit = yield transaction_limit_service_1.TransactionLimitService.getWeeklyLimit(accountType, verificationLevel);
            const monthlyLimit = yield transaction_limit_service_1.TransactionLimitService.getMonthlyLimit(accountType, verificationLevel);
            // Check if payment amount is within the allowed limits
            const currentDate = new Date();
            const dailyAmount = yield payment_amount_service_1.PaymentAmountService.getDailyPaymentAmount(walletId, currentDate);
            const weeklyAmount = yield payment_amount_service_1.PaymentAmountService.getWeeklyPaymentAmount(walletId, currentDate);
            const monthlyAmount = yield payment_amount_service_1.PaymentAmountService.getMonthlyPaymentAmount(walletId, currentDate);
            console.log(`you have so far used ${dailyAmount} from your daily limit of ${dailyLimit}`);
            if (paymentAmount <= 0) {
                console.log(`Payment amount ${paymentAmount} is not a positive value.`);
                return false;
            }
            else if (dailyAmount + paymentAmount > dailyLimit) {
                console.log(`Daily payment limit exceeded for user ${walletId}.`);
                return false;
            }
            else if (weeklyAmount + paymentAmount > weeklyLimit) {
                console.log(`Weekly payment limit exceeded for user ${walletId}.`);
                return false;
            }
            else if (monthlyAmount + paymentAmount > monthlyLimit) {
                console.log(`Monthly payment limit exceeded for user ${walletId}.`);
                return false;
            }
            else {
                return true;
            }
            return true;
        });
    }
    //import { PaymentRecipientModel } from './paymentRecipientModel';
    static checkPaymentRecipient(recipientWalletId) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipientWallet = yield wallet_service_1.WalletService.getWallet(recipientWalletId);
            if (!recipientWallet) {
                console.log(`Recipient wallet ${recipientWalletId} not found.`);
                return false;
            }
            else if (!recipientWallet.verificationLevel) {
                console.log(`Recipient ${recipientWalletId} is not verified.`);
                return false;
            }
            else {
                return true;
            }
        });
    }
    static checkPaymentMethod(paymentMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            // Perform payment method validation checks, e.g., check if payment method is supported and not expired
            // Return true if payment method is valid, false otherwise
            return true;
        });
    }
}
exports.PaymentService = PaymentService;
