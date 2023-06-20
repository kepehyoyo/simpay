"use strict";
//withdrawning money from the wallet(Post)
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
exports.withdrawWalletRouter = void 0;
/* Withdraw Money: This API endpoint allows the user to withdraw money from their wallet to their bank account.
Endpoint: /api/wallet/withdraw
Method: POST
Request Body: { "walletId": "wallet123", "amount": 300, "bankDetails": { "bankName": "ABC Bank", "accountNumber": "0987654321" } }
Response Body: { "walletId": "wallet123", "balance": 200 } */
const common_v2_1 = require("@cygnetops/common-v2");
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator"); /*
import { KafkaProducer } from '../events/kafkaProducer'; */
const wallet_1 = require("../models/wallet");
/* import { WithdrawMoneyEvent } from '../events/withdrawMoneyEvent';
import { WithdrawMoneyPublisher } from '../events/publishers/withdrawMoneyPublisher';
 */
const router = express_1.default.Router();
exports.withdrawWalletRouter = router;
router.post("/api/wallet/withdraw", [
    (0, express_validator_1.body)('wallet_id').isUUID(),
    (0, express_validator_1.body)('amount').isFloat({ min: 0 }),
    common_v2_1.validateRequest,
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { wallet_id, amount } = req.body;
    try {
        // Check if the wallet exists
        const wallet = yield wallet_1.Wallet.findOne({ wallet_id });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        // Check if there is enough balance to withdraw
        if (wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        // Update the wallet balance
        wallet.balance -= amount;
        wallet.updated_at = new Date();
        yield wallet.save();
        /*     // Publish a withdraw money event
            const kafkaProducer = new KafkaProducer();
            const withdrawMoneyEvent = new WithdrawMoneyEvent({ walletId, amount });
            const withdrawMoneyPublisher = new WithdrawMoneyPublisher(kafkaProducer);
            await withdrawMoneyPublisher.publish(withdrawMoneyEvent);
         */
        return res.status(200).json({ message: 'Withdrawal successful', balance: wallet.balance });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}));
