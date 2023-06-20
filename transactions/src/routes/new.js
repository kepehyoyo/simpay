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
exports.createTransactionRouter = void 0;
// Import required modules and dependencies
const common_v2_1 = require("@cygnetops/common-v2");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const transaction_1 = require("../models/transaction");
const transaction_service_1 = require("../service/transaction-service");
const uuid_1 = require("uuid");
const wallet_service_1 = require("../service/wallet-service");
const kafka_producer_1 = require("../events/kafka-producer");
const transaction_events_1 = require("../events/transaction-events");
const transaction_publisher_1 = require("../events/publishers/transaction-publisher");
// Define router
const router = (0, express_1.Router)();
exports.createTransactionRouter = router;
// Create transaction API endpoint
router.post("/api/transactions/payment-initiated", [
    // Validate request body
    (0, express_validator_1.body)("sourceWalletId")
        .isString()
        .notEmpty()
        .withMessage("Source wallet ID is required"),
    (0, express_validator_1.body)("destinationWalletId")
        .isString()
        .notEmpty()
        .withMessage("Destination wallet ID is required"),
    (0, express_validator_1.body)("amount")
        .isFloat()
        .notEmpty()
        .withMessage("Amount is required and must be numeric"),
    (0, express_validator_1.body)("type")
        .isIn(['transfer'])
], common_v2_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get transaction details from request body
        const { sourceWalletId, destinationWalletId, amount } = req.body;
        console.log(`sourcewalledId = ${sourceWalletId} , destinationId =${destinationWalletId} and amount= ${amount}`);
        console.log("what is happening");
        // Create transaction object
        const sourceWallet = yield wallet_service_1.WalletService.getWallet(sourceWalletId);
        const destinationWallet = yield wallet_service_1.WalletService.getWallet(destinationWalletId);
        console.log(`this is first source wallet balance = ${sourceWallet.balance} and destination wallet balance = ${destinationWallet.balance} `);
        if (!sourceWallet) {
            console.log("Source Wallet does not exist");
        }
        if (!destinationWallet) {
            console.log("Destination Wallet does not exist");
        }
        const transactionId = (0, uuid_1.v4)();
        const transaction = transaction_1.Transaction.build({
            transactionId,
            sourceWalletId,
            destinationWalletId,
            transactionType: transaction_1.TransactionType.TRANSFER,
            transactionAmount: amount,
            transactionCurrency: "XAF",
            transactionFee: 2,
            transactionStatus: transaction_1.TransactionStatus.PENDING,
            transactionDescription: "Transfering money",
        });
        console.log(`this is first build transaction ${transaction}`);
        // Save transaction
        const createdTransaction = yield transaction_service_1.TransactionService.createTransaction(transaction);
        try {
            yield createdTransaction.save();
            console.log(`this is transaction ${createdTransaction}`);
            // Create a new state machine instance with the initial state
            // const  transactionStateMachine = createTransactionStateMachine(transactionId)
            // Publish IntiatePayment  event to Kafka topic 
            const kafkaProducer = new kafka_producer_1.KafkaProducer();
            const initiatePaymentEvent = new transaction_events_1.InitiatePaymentEvent({ transaction });
            const initiatePaymentPublisher = new transaction_publisher_1.InitiatePaymentPublisher(kafkaProducer);
            yield initiatePaymentPublisher.publish(initiatePaymentEvent);
        }
        catch (err) {
            console.error("Error creating transaction:", err);
            res.status(500).json({ message: "Server save and publish error" });
        }
        // Return response with transaction and updated wallet details
        console.log(createdTransaction);
        return res.status(201).json({
            transaction: createdTransaction,
            //  source_wallet: updatedSourceWallet,
            //   destination_wallet: updatedDestinationWallet,
        });
    }
    catch (err) {
        // console.error(err.message);
        return res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
}));
