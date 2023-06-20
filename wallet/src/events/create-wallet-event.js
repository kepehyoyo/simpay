"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundsAvailableEvent = exports.CreateWalletEvent = void 0;
const subjects_1 = require("./subjects");
class CreateWalletEvent {
    constructor(data) {
        this.subject = subjects_1.Subjects.WalletCreated;
        this.data = data;
    }
}
exports.CreateWalletEvent = CreateWalletEvent;
class FundsAvailableEvent {
    constructor(data) {
        this.subject = subjects_1.Subjects.FundsAvailable;
        this.data = data;
    }
}
exports.FundsAvailableEvent = FundsAvailableEvent;
