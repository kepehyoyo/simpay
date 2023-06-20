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
exports.ValidationService = void 0;
const compliance_1 = require("./compliance");
const fraud_detection_1 = require("./fraud-detection");
const payment_service_1 = require("./payment-service");
const user_authorisation_1 = require("./user-authorisation");
class ValidationService {
    static validatePayment(sourceWalletId, paymentAmount, accountType, verificationLevel, recipientWalletId, paymentMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user is authorized to make payments
            const isUserAuthorized = yield user_authorisation_1.UserAuthService.checkUserAuthorization(sourceWalletId);
            if (!isUserAuthorized) {
                console.log(`User ${sourceWalletId} is not authorized to make payments.`);
                return false;
            }
            // Check if payment amount is valid
            const isValidAmount = yield payment_service_1.PaymentService.checkPaymentAmount(sourceWalletId, paymentAmount, accountType, verificationLevel);
            if (!isValidAmount) {
                console.log(`Invalid payment amount: ${paymentAmount}.`);
                return false;
            }
            // Check if payment recipient is valid
            const isValidRecipient = yield payment_service_1.PaymentService.checkPaymentRecipient(recipientWalletId);
            if (!isValidRecipient) {
                console.log(`Invalid payment recipient: ${recipientWalletId}.`);
                return false;
            }
            // Check if payment method is valid
            const isValidMethod = yield payment_service_1.PaymentService.checkPaymentMethod(paymentMethod);
            if (!isValidMethod) {
                console.log(`Invalid payment method: ${paymentMethod}.`);
                return false;
            }
            // Perform fraud detection checks
            const isFraudulent = yield fraud_detection_1.FraudService.checkForFraud(paymentAmount, recipientWalletId, paymentMethod);
            if (isFraudulent) {
                console.log(`Fraudulent payment detected: amount=${paymentAmount}, recipient=${recipientWalletId}, method=${paymentMethod}.`);
                return false;
            }
            // Perform compliance checks
            const isComplaint = yield compliance_1.ComplainceService.checkCompliance(sourceWalletId);
            if (!isComplaint) {
                console.log(` Payment is non-Complain for: userId=${sourceWalletId}.`);
                return false;
            }
            // Payment is valid if all checks pass
            return true;
        });
    }
}
exports.ValidationService = ValidationService;
