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
exports.Transaction = void 0;
const uuid_1 = require("uuid");
const transaction_1 = require("../models/transaction");
class Transaction {
    constructor(wallet) {
        this.wallet = wallet;
    }
    createTransaction(amount, type, transactionStatus, description) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a new transaction object
            const transaction_id = (0, uuid_1.v4)();
            const transaction = transaction_1.Transaction.build({
                transaction_id,
                wallet_id: this.wallet.walletId,
                type,
                transactionStatus,
                amount,
                description,
            });
            // Update wallet balance and save transaction
            if (type === transaction_1.TransactionType.CREDIT && transactionStatus === transaction_1.TransactionStatus.SUCCESSFUL) {
                this.wallet.balance += amount;
            }
            else {
                this.wallet.balance -= amount;
            }
            this.wallet.updated_at = new Date();
            yield Promise.all([this.wallet.save(), transaction.save()]);
            return transaction;
        });
    }
}
exports.Transaction = Transaction;
