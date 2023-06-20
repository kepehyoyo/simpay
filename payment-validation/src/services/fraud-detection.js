"use strict";
//import axios from 'axios';
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
exports.FraudService = void 0;
class FraudService {
    /* const FRAUD_API_KEY = 'your_fraud_detection_api_key_here';
     */
    /* static async detectFraud(paymentAmount: number, paymentRecipient: string): Promise<boolean> {
    const response = await axios.post(`https://fraud-detection-api.com/detect_fraud`, {
    amount: paymentAmount,
    recipient: paymentRecipient,
    //api_key: FRAUD_API_KEY,
    });
    
    const isFraudulent = response.data.is_fraudulent;
    
        return isFraudulent;
    }
     */
    static checkForFraud(paymentAmount, paymentRecipient, paymentMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            // Perform fraud detection checks, e.g., check if payment amount or recipient is associated with a known fraudster
            // Return true if fraudulent activity is detected, false otherwise
            return false;
        });
    }
}
exports.FraudService = FraudService;
