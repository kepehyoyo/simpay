"use strict";
//view transactions from wallet (GET)
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
exports.transactionsWalletRouter = void 0;
/* Get Transaction History: This API endpoint retrieves the transaction history of the user's digital wallet.
Endpoint: /api/wallet/transactions
Method: GET
Request Body: { "walletId": "wallet123" }
Response Body: { "transactions":
[ { "transactionId": "txn123", "amount": 500, "type": "credit", "description": "Added money to wallet", "timestamp":
 "2022-03-15T10:30:00Z" } ] } */
// src/controllers/walletController.ts
const common_v2_1 = require("@cygnetops/common-v2");
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const transaction_1 = require("../models/transaction");
const router = express_1.default.Router();
exports.transactionsWalletRouter = router;
router.get("/api/wallet/:wallet_id/transactions", [(0, express_validator_1.param)('wallet_id').isUUID()], common_v2_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { wallet_id } = req.params;
    try {
        // Find transactions for the given wallet ID
        const transactions = yield transaction_1.Transaction.find({ wallet_id }).sort({ createdAt: -1 });
        return res.status(200).json({ transactions });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}));
