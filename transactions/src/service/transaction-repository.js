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
exports.TransactionRepository = void 0;
const transaction_1 = require("../models/transaction");
class TransactionRepository {
    constructor() {
        this.transactions = [];
    }
    find(query, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create the Mongoose query object
            const mongooseQuery = transaction_1.Transaction.find(query);
            // Add pagination options to the query
            mongooseQuery.skip((page - 1) * limit).limit(limit);
            // Execute the query
            const transactions = yield mongooseQuery.exec();
            // Get the total count of matching documents
            const count = yield transaction_1.Transaction.countDocuments(query);
            // Map the documents to the Transaction model
            const mappedTransactions = transactions.map((doc) => doc.toObject());
            return { transactions: mappedTransactions, count };
        });
    }
    addTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            this.transactions.push(transaction);
        });
    }
}
exports.TransactionRepository = TransactionRepository;
