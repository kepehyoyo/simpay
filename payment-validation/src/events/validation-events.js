"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidationEvent = void 0;
const subjects_1 = require("./subjects");
class PaymentValidationEvent {
    constructor(data) {
        this.subject = subjects_1.Subjects.PAYMENT_VALIDATION;
        this.data = data;
    }
}
exports.PaymentValidationEvent = PaymentValidationEvent;
