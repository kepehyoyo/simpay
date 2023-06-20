"use strict";
//Transferring money from the wallet (POST)
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferMoneyWalletRouter = void 0;
/* Transfer Money: This API endpoint allows the user to transfer money from their wallet to another user's wallet.
Endpoint: /api/wallet/transfer
Method: POST
Request Body: { "fromWalletId": "wallet123", "toWalletId": "wallet456", "amount": 200 }
Response Body: { "fromWalletId": "wallet123", "toWalletId": "wallet456", "amount": 200 } */
const common_v2_1 = require("@cygnetops/common-v2");
const express_1 = __importDefault(require("express"));
/* import { KafkaProducer } from '../events/kafkaProducer';
import { TransferMoneyEvent } from '../events/transferMoneyEvent';
import { TransferMoneyPublisher } from '../events/publishers/transferMoneyPublisher';
*/
const express_validator_1 = require("express-validator");
const transaction_1 = require("../components/transaction");
const transaction_2 = require("../models/transaction");
const wallet_1 = require("../models/wallet");
const router = express_1.default.Router();
exports.transferMoneyWalletRouter = router;
router.post("/api/wallet/transfer-money", [
    (0, express_validator_1.body)("senderWallet_id").notEmpty().withMessage("Sender ID is required"),
    (0, express_validator_1.body)("receiverWallet_id").notEmpty().withMessage("Reviever ID is required"),
    (0, express_validator_1.body)('amount').isFloat({ min: 0 }),
    common_v2_1.validateRequest,
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderWallet_id, receiverWallet_id, amount } = req.body;
    try {
        // Find sender and receiver wallets
        const senderWallet = yield wallet_1.Wallet.findOne({ wallet_id: senderWallet_id });
        const receiverWallet = yield wallet_1.Wallet.findOne({ wallet_id: receiverWallet_id });
        if (!senderWallet || !receiverWallet) {
            return res.status(400).json({ message: 'Invalid wallet IDs' });
        }
        // Check if sender has enough balance
        if (senderWallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        // Deduct amount from sender wallet and add to receiver wallet
        const senderTransaction = new transaction_1.Transaction(senderWallet);
        const receiverTransaction = new transaction_1.Transaction(receiverWallet);
        const newSenderTransaction = yield senderTransaction.createTransaction(amount, transaction_2.TransactionType.DEBIT, transaction_2.TransactionStatus.SUCCESSFUL, receiverWallet_id);
        const newReceiverTransaction = yield receiverTransaction.createTransaction(amount, transaction_2.TransactionType.CREDIT, transaction_2.TransactionStatus.SUCCESSFUL, senderWallet_id);
        /*  // Publish a transfer money event
         const kafkaProducer = new KafkaProducer();
         const transferMoneyEvent = new TransferMoneyEvent({
         senderWalletId,
         receiverWalletId,
         amount,
         });
         const transferMoneyPublisher = new TransferMoneyPublisher(kafkaProducer);
         await transferMoneyPublisher.publish(transferMoneyEvent); */
        return res.status(200).json({ sender_balance: senderWallet.balance, receiver_balance: receiverWallet.balance });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}));
