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
exports.rejectTransaction = exports.approveTransaction = exports.getPendingTransactions = exports.TransactionService = void 0;
const transaction_1 = require("../models/transaction");
const wallet_service_1 = require("./wallet-service");
const transaction_repository_1 = require("./transaction-repository");
//import axios from 'axios';
//import { Kafka, Producer } from "kafkajs";
class TransactionService {
    constructor() {
        /* private kafka: Kafka;
        private producer: Producer; */
        this.AUTH_MICROSERVICE_BASE_URL = 'http://auth-service.example.com';
        // Initialize Kafka client and producer
        /* this.kafka = new Kafka({
          clientId: "transaction-service",
          brokers: ["localhost:9092"],
        });
        this.producer = this.kafka.producer();
        this.producer.connect(); */
    }
    /*
        static async initiateTransaction(paymentInfo: any): Promise<any> {
          // Create a Kafka producer instance
        
          try {
            // Connect to the Kafka cluster
            await producer.connect();
      
            // Publish a "transaction-initiated" event to Kafka with the payment information
            await producer.send({
              topic: 'transaction-initiated',
              messages: [{ value: JSON.stringify(paymentInfo) }],
            });
      
            // Return a success response
            return { paymentInfo };
          } catch (error) {
            // Return an error response
            throw new Error(`Failed to initiate payment: ${error.message}`);
          } finally {
            // Disconnect from the Kafka cluster
            await producer.disconnect();
          }
        } */
    static findTransactionById(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find transactionin the database by Id
                const transaction = yield transaction_1.Transaction.findOne({ transactionId });
                // If the transaction is not found, return a 404 error
                if (!transaction) {
                    throw new Error('Transaction not found');
                }
                return transaction;
            }
            catch (error) {
                // If there's an error updating the transaction, return a 500 error
                console.error(error);
                throw new Error('Error finding transaction');
            }
        });
    }
    static createTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Send transaction message to Kafka topic
                const message = {
                    transaction_id: transaction.transactionId,
                    source_wallet_id: transaction.sourceWalletId,
                    destination_wallet_id: transaction.destinationWalletId,
                    transaction_type: transaction.transactionType,
                    transaction_amount: transaction.transactionAmount,
                    transaction_currency: transaction.transactionCurrency,
                    transaction_fee: transaction.transactionFee,
                    transaction_status: transaction.transactionStatus,
                    transaction_date: transaction.transactionDate,
                    transaction_description: transaction.transactionDescription,
                    metadata: transaction.metadata,
                };
                // Check if source wallet has sufficient balance
                const sourceWallet = yield wallet_service_1.WalletService.getWallet(transaction.sourceWalletId);
                if (sourceWallet.balance < transaction.transactionAmount) {
                    throw new Error(" Insufficient balance ");
                }
                // Update source wallet balance
                const updatedSourceWallet = yield wallet_service_1.WalletService.debitWalletBalance(transaction.sourceWalletId, (transaction.transactionAmount + transaction.transactionFee));
                // Update destination wallet balance
                const destinationWallet = yield wallet_service_1.WalletService.getWallet(transaction.destinationWalletId);
                const updatedDestinationWallet = yield wallet_service_1.WalletService.creditWalletBalance(transaction.destinationWalletId, transaction.transactionAmount);
                /*   await this.producer.send({
                    topic: "transaction",
                    messages: [{ value: JSON.stringify(message) }],
                  });
             */
                // Return created transaction
                return transaction;
            }
            catch (err) {
                console.error(err);
                throw new Error("Error creating transaction");
            }
        });
    }
    static updateTransactionStatus(transactionId, status, completionTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedTransaction = yield transaction_1.Transaction.findOneAndUpdate({ transactionId }, { transactionStatus: status, transactionDate: completionTime }, { new: true } // return the updated document
                );
                console.log(`Transaction ${transactionId} status updated to ${status}`);
                return updatedTransaction;
            }
            catch (err) {
                console.error(`Failed to update transaction ${transactionId} status:`, err);
                throw err;
            }
        });
    }
    /*
      async addTransaction(transaction: TransactionDoc): Promise<void> {
        if (!transaction.sourceWalletId || !transaction.destinationWalletId || !transaction.transactionAmount) {
          throw new Error('sourceWalletId, destinationWalletId, and amount are required fields');
        }
    
        if (transaction.transactionAmount <= 0) {
          throw new Error('amount must be a positive number');
        }
    
        await this.transactionRepository.addTransaction(transaction);
      }
     */
    static findTransactionsbyId(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Use the query object to build a MongoDB query
                const mongoQuery = {};
                if (query.sourceWalletId || query.destinationWalletId) {
                    mongoQuery.$or = [];
                    if (query.sourceWalletId) {
                        mongoQuery.$or.push({ sourceWalletId: query.sourceWalletId });
                    }
                    if (query.destinationWalletId) {
                        mongoQuery.$or.push({ destinationWalletId: query.destinationWalletId });
                    }
                }
                if (query.status) {
                    mongoQuery.status = query.status;
                }
                if (query.type) {
                    mongoQuery.type = query.type;
                }
                if (query.fromDate || query.toDate) {
                    mongoQuery.createdAt = {};
                    if (query.fromDate) {
                        mongoQuery.createdAt.$gte = query.fromDate;
                    }
                    if (query.toDate) {
                        mongoQuery.createdAt.$lte = query.toDate;
                    }
                }
                // Use the query object to build a Mongoose query
                const mongooseQuery = transaction_1.Transaction.find(mongoQuery)
                    .sort({ createdAt: -1 })
                    .skip((query.page - 1) * query.limit)
                    .limit(query.limit);
                // Execute the Mongoose query
                const [transactions, count] = yield Promise.all([mongooseQuery, transaction_1.Transaction.countDocuments(mongoQuery)]);
                return { transactions, count };
            }
            catch (error) {
                console.error('Error in TransactionService.findTransactions', error);
                throw error;
            }
        });
    }
    static findTransactions(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sourceWalletId, destinationWalletId, status, type, fromDate, toDate, page, limit } = query;
            // Build query object based on input params
            const q = {};
            if (sourceWalletId) {
                q.sourceWalletId = sourceWalletId;
            }
            if (destinationWalletId) {
                q.destinationWalletId = destinationWalletId;
            }
            if (status) {
                q.status = status;
            }
            if (type) {
                q.type = type;
            }
            if (fromDate || toDate) {
                q.transaction_date = {};
                if (fromDate) {
                    q.transaction_date.$gte = fromDate;
                }
                if (toDate) {
                    q.transaction_date.$lte = toDate;
                }
            }
            // Call repository to retrieve transactions
            const transactionRepository = new transaction_repository_1.TransactionRepository();
            const { transactions, count } = yield transactionRepository.find(q, page, limit);
            return { transactions, count };
        });
    }
}
exports.TransactionService = TransactionService;
function getPendingTransactions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Find all pending transactions in the database
            const transactions = yield transaction_1.Transaction.find({ status: 'pending' });
            // Return the transactions in the response
            return transactions;
        }
        catch (error) {
            // If there's an error retrieving the transactions, return a 500 error
            console.error(error);
            throw new Error('Error retrieving transactions');
        }
    });
}
exports.getPendingTransactions = getPendingTransactions;
function approveTransaction(transactionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Find the transaction in the database by ID
            const transaction = yield transaction_1.Transaction.findById(transactionId);
            // If the transaction is not found, return a 404 error
            if (!transaction) {
                throw new Error('Transaction not found');
            }
            // If the transaction is not pending, return a 400 error
            if (transaction.transactionStatus !== transaction_1.TransactionStatus.PENDING) {
                throw new Error('Transaction is not pending');
            }
            // Update the transaction status to approved in the database
            transaction.transactionStatus = transaction_1.TransactionStatus.APPROVED;
            yield transaction.save();
            // Return the updated transaction in the response
            return transaction;
        }
        catch (error) {
            // If there's an error updating the transaction, return a 500 error
            console.error(error);
            throw new Error('Error updating transaction');
        }
    });
}
exports.approveTransaction = approveTransaction;
function rejectTransaction(transactionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Find the transaction in the database by ID
            const transaction = yield transaction_1.Transaction.findOne({ transactionId });
            // If the transaction is not found, return a 404 error
            if (!transaction) {
                throw new Error('Transaction not found');
            }
            // If the transaction is not pending, return a 400 error
            if (transaction.transactionStatus !== transaction_1.TransactionStatus.PENDING) {
                throw new Error('Transaction is not pending');
            }
            // Update the transaction status to rejected in the database
            transaction.transactionStatus = transaction_1.TransactionStatus.REJECTED;
            yield transaction.save();
            /*
              // Update the sender and recipient wallets' balances in the database
              const senderWallet = await Wallet.findById(transaction.senderWalletId);
              const recipientWallet = await Wallet.findById(transaction.recipientWalletId);
              senderWallet.balance += transaction.amount;
              recipientWallet.balance -= transaction.amount;
              await Promise.all([senderWallet.save(), recipientWallet.save()]);
            */
            // Return the updated transactio n in the response
            return transaction;
        }
        catch (error) {
            // If there's an error updating the transaction, return a 500 error
            console.error(error);
            throw new Error('Error updating transaction');
        }
    });
}
exports.rejectTransaction = rejectTransaction;
