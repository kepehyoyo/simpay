"use strict";
//Adding money to the wallet (POST)
/* Add Money: This API endpoint allows the user to add money to their wallet using different payment methods such as net banking, credit/debit cards, or UPI.
Endpoint: /api/wallet/add-money
Method: POST
Request Body: { "walletId": "wallet123",
 "amount": 500,
 "paymentMethod": "netbanking",
  "paymentDetails": { "bankName": "XYZ Bank", "accountNumber": "1234567890" } }
Response Body: { "walletId": "wallet123", "balance": 500 } */
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
exports.addMoneyWalletRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
/* import { KafkaProducer } from '../events/kafkaProducer';
import { AddMoneyEvent } from '../events/addMoneyEvent';
import { AddMoneyPublisher } from '../events/publishers/addMoneyPublisher';
*/
const wallet_1 = require("../models/wallet");
const common_v2_1 = require("@cygnetops/common-v2");
const transaction_1 = require("../models/transaction");
const transaction_2 = require("../components/transaction");
const router = express_1.default.Router();
exports.addMoneyWalletRouter = router;
router.post("/api/wallet/:walletId/add-money", [
    (0, express_validator_1.param)('walletId').isUUID(),
    (0, express_validator_1.body)('amount').isFloat({ min: 0 }),
], common_v2_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    const { walletId } = req.params;
    try {
        // Find the wallet and update its balance
        const wallet = yield wallet_1.Wallet.findOne({ walletId });
        if (wallet) {
            const transaction = new transaction_2.Transaction(wallet);
            const newTransaction = yield transaction.createTransaction(amount, transaction_1.TransactionType.CREDIT, transaction_1.TransactionStatus.SUCCESSFUL, 'Deposit from bank');
            return res.status(200).json({ transaction: newTransaction.transaction_id,
                transactionType: newTransaction.type,
                balance: wallet.balance,
            });
        }
        else {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        /*  // Publish an add money event
         const kafkaProducer = new KafkaProducer();
         const addMoneyEvent = new AddMoneyEvent({ wallet_id, amount });
         const addMoneyPublisher = new AddMoneyPublisher(kafkaProducer);
         await addMoneyPublisher.publish(addMoneyEvent);
      */
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}));
