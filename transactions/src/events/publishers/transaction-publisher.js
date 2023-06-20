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
exports.CreateTransactionPublisher = exports.FailRefundPublisher = exports.FailPaymentPublisher = exports.ConfirmRefundPublisher = exports.ConfirmPaymentPublisher = exports.InitiateRefundPublisher = exports.ConfirmFundsPublisher = exports.InitiatePaymentPublisher = void 0;
const subjects_1 = require("../subjects");
class InitiatePaymentPublisher {
    constructor(producer) {
        this.topic = subjects_1.Subjects.PAYMENT_INITIATED;
        this.producer = producer;
    }
    publish(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.connect();
            yield this.producer.sendMessage(this.topic, JSON.stringify(event));
            yield this.producer.disconnect();
        });
    }
}
exports.InitiatePaymentPublisher = InitiatePaymentPublisher;
class ConfirmFundsPublisher {
    constructor(producer) {
        this.topic = subjects_1.Subjects.CONFIRM_FUNDS;
        this.producer = producer;
    }
    publish(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.connect();
            yield this.producer.sendMessage(this.topic, JSON.stringify(event));
            yield this.producer.disconnect();
        });
    }
}
exports.ConfirmFundsPublisher = ConfirmFundsPublisher;
class InitiateRefundPublisher {
    constructor(producer) {
        this.topic = subjects_1.Subjects.REFUND_INITIATED;
        this.producer = producer;
    }
    publish(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.connect();
            yield this.producer.sendMessage(this.topic, JSON.stringify(event));
            yield this.producer.disconnect();
        });
    }
}
exports.InitiateRefundPublisher = InitiateRefundPublisher;
class ConfirmPaymentPublisher {
    constructor(producer) {
        this.topic = subjects_1.Subjects.PAYMENT_CONFIRMED;
        this.producer = producer;
    }
    publish(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.connect();
            yield this.producer.sendMessage(this.topic, JSON.stringify(event));
            yield this.producer.disconnect();
        });
    }
}
exports.ConfirmPaymentPublisher = ConfirmPaymentPublisher;
class ConfirmRefundPublisher {
    constructor(producer) {
        this.topic = subjects_1.Subjects.REFUND_CONFIRMED;
        this.producer = producer;
    }
    publish(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.connect();
            yield this.producer.sendMessage(this.topic, JSON.stringify(event));
            yield this.producer.disconnect();
        });
    }
}
exports.ConfirmRefundPublisher = ConfirmRefundPublisher;
class FailPaymentPublisher {
    constructor(producer) {
        this.topic = subjects_1.Subjects.PAYMENT_FAILED;
        this.producer = producer;
    }
    publish(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.connect();
            yield this.producer.sendMessage(this.topic, JSON.stringify(event));
            yield this.producer.disconnect();
        });
    }
}
exports.FailPaymentPublisher = FailPaymentPublisher;
class FailRefundPublisher {
    constructor(producer) {
        this.topic = subjects_1.Subjects.REFUND_FAILED;
        this.producer = producer;
    }
    publish(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.connect();
            yield this.producer.sendMessage(this.topic, JSON.stringify(event));
            yield this.producer.disconnect();
        });
    }
}
exports.FailRefundPublisher = FailRefundPublisher;
class CreateTransactionPublisher {
    constructor(producer) {
        this.topic = subjects_1.Subjects.TRANSACTION_CREATED;
        this.producer = producer;
    }
    publish(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.connect();
            yield this.producer.sendMessage(this.topic, JSON.stringify(event));
            yield this.producer.disconnect();
        });
    }
}
exports.CreateTransactionPublisher = CreateTransactionPublisher;
