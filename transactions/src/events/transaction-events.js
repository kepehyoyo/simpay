"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTransactionEvent = exports.CreateTransactionEvent = exports.FailRefundEvent = exports.ConfirmRefundEvent = exports.InitiateRefundEvent = exports.FailPaymentEvent = exports.ConfirmFundsevent = exports.ConfirmPaymentEvent = exports.InitiatePaymentEvent = void 0;
const subjects_1 = require("./subjects");
class InitiatePaymentEvent {
    constructor(data) {
        this.subject = subjects_1.Subjects.PAYMENT_INITIATED;
        this.data = data;
    }
}
exports.InitiatePaymentEvent = InitiatePaymentEvent;
class ConfirmPaymentEvent {
    constructor(data) {
        this.subject = subjects_1.Subjects.PAYMENT_CONFIRMED;
        this.data = data;
    }
}
exports.ConfirmPaymentEvent = ConfirmPaymentEvent;
class ConfirmFundsevent {
    constructor(data) {
        this.subject = subjects_1.Subjects.CONFIRM_FUNDS;
        this.data = data;
    }
}
exports.ConfirmFundsevent = ConfirmFundsevent;
class FailPaymentEvent {
    constructor(data) {
        this.subject = subjects_1.Subjects.PAYMENT_FAILED;
        this.data = data;
    }
}
exports.FailPaymentEvent = FailPaymentEvent;
class InitiateRefundEvent {
    constructor(data) {
        this.subject = subjects_1.Subjects.REFUND_INITIATED;
        this.data = data;
    }
}
exports.InitiateRefundEvent = InitiateRefundEvent;
class ConfirmRefundEvent {
    constructor(data) {
        this.subject = subjects_1.Subjects.REFUND_CONFIRMED;
        this.data = data;
    }
}
exports.ConfirmRefundEvent = ConfirmRefundEvent;
class FailRefundEvent {
    constructor(data) {
        this.subject = subjects_1.Subjects.REFUND_FAILED;
        this.data = data;
    }
}
exports.FailRefundEvent = FailRefundEvent;
class CreateTransactionEvent {
    constructor(data) {
        this.subject = subjects_1.Subjects.TRANSACTION_CREATED;
        this.data = data;
    }
}
exports.CreateTransactionEvent = CreateTransactionEvent;
class UpdateTransactionEvent {
    constructor(data) {
        this.subject = subjects_1.Subjects.TRANSACTION_UPDATED;
        this.data = data;
    }
}
exports.UpdateTransactionEvent = UpdateTransactionEvent;
