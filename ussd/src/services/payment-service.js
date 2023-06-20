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
const transaction_1 = require("../models/transaction");
class PaymentService {
    constructor(kafka) {
        this.kafka = kafka;
    }
    processPayment(phoneNumber, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            // code to process payment
            const transaction = {
                phoneNumber,
                amount,
                timestamp: new Date(),
                status: transaction_1.TransactionStatus.SUCCESSFUL,
                transactionId: Math.random().toString(36).substr(2, 9),
            };
            // publish payment event to Kafka
            yield this.kafka.producer().send({
                topic: "payment_events",
                messages: [
                    {
                        key: phoneNumber,
                        value: JSON.stringify({
                            type: "payment",
                            payload: transaction,
                        }),
                    },
                ],
            });
            return transaction;
        });
    }
}
exports.default = PaymentService;
