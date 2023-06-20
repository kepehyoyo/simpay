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
exports.getTransactionsByWalletId = exports.debitWalletBalance = exports.creditWalletBalance = exports.getWallet = exports.createWallet = exports.createWalletwithId = void 0;
const create_wallet_event_1 = require("../events/create-wallet-event");
const kafka_producer_1 = require("../events/kafka-producer");
const wallet_created_publisher_1 = require("../events/publishers/wallet-created-publisher");
const transaction_1 = require("../models/transaction");
const wallet_1 = require("../models/wallet");
const common_v2_1 = require("@cygnetops/common-v2");
const uuid_1 = require("uuid");
/* export class WalletService {
} */
function createWalletwithId(walletId, userId, balance, currency) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create a new wallet in the database
            const existingWallet = yield wallet_1.Wallet.findOne({ walletId });
            if (existingWallet) {
                throw new common_v2_1.BadRequestError('wallet already exist');
            }
            const balance = 1000;
            const newWallet = wallet_1.Wallet.build({ walletId, userId, balance, currency });
            yield newWallet.save();
            console.log(JSON.stringify(newWallet));
            return newWallet;
        }
        catch (error) {
            console.error(error);
            throw new Error('Error creating wallet');
        }
    });
}
exports.createWalletwithId = createWalletwithId;
// new wallet should have a zero balance 
function createWallet(userId, currency) {
    return __awaiter(this, void 0, void 0, function* () {
        const walletId = (0, uuid_1.v4)();
        try {
            // Create a new wallet in the database
            const existingWallet = yield wallet_1.Wallet.findOne({ walletId });
            if (existingWallet) {
                throw new common_v2_1.BadRequestError('wallet already exist');
            }
            const balance = 1000;
            const newWallet = wallet_1.Wallet.build({ walletId, userId, balance, currency });
            yield newWallet.save();
            console.log(JSON.stringify(newWallet));
            // Publish walletCreated event to Kafka topic 
            const kafkaProducer = new kafka_producer_1.KafkaProducer();
            const createWalletEvent = new create_wallet_event_1.CreateWalletEvent({ walletId, balance, currency });
            const createWalletPublisher = new wallet_created_publisher_1.CreateWalletPublisher(kafkaProducer);
            yield createWalletPublisher.publish(createWalletEvent);
            return newWallet;
        }
        catch (error) {
            console.error(error);
            throw new Error('Error creating wallet');
        }
    });
}
exports.createWallet = createWallet;
function getWallet(walletId) {
    return __awaiter(this, void 0, void 0, function* () {
        const wallet = yield wallet_1.Wallet.findOne({ walletId });
        if (!wallet) {
            throw new Error(`Wallet with ID ${walletId} not found`);
        }
        return wallet;
    });
}
exports.getWallet = getWallet;
function creditWalletBalance(walletId, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const wallet = yield getWallet(walletId);
        wallet.balance += amount;
        wallet.save();
        console.log(wallet.balance);
        return wallet;
    });
}
exports.creditWalletBalance = creditWalletBalance;
function debitWalletBalance(walletId, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const wallet = yield getWallet(walletId);
        wallet.balance -= amount;
        wallet.save();
        console.log(wallet.balance);
        return wallet;
    });
}
exports.debitWalletBalance = debitWalletBalance;
function getTransactionsByWalletId(walletId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Find all transactions for the wallet in the database
            const transactions = yield transaction_1.Transaction.find({ $or: [{ senderWalletId: walletId }, { recipientWalletId: walletId }] });
            // Return the transactions in the response
            console.log(transactions);
            return transactions;
        }
        catch (error) {
            // If there's an error retrieving the transactions, return a 500 error
            console.error(error);
            throw new Error('Error retrieving transactions');
        }
    });
}
exports.getTransactionsByWalletId = getTransactionsByWalletId;
