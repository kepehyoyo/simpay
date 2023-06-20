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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusRouter = void 0;
const express_1 = __importDefault(require("express"));
const transaction_1 = require("../models/transaction");
// Create an Express application
const router = express_1.default.Router();
exports.getStatusRouter = router;
// Define an API route to get the status of a transaction
router.get('/api/transactions/:transactionId/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.params;
    try {
        // Retrieve the transaction from the database
        const transaction = yield transaction_1.Transaction.findOne({ transactionId });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        // Send the transaction status as a JSON response
        res.status(200).json({ transactionId: transaction.transactionId, status: transaction.transactionStatus });
    }
    catch (error) {
        // Handle any errors that occur during the database query
        console.error('Failed to retrieve transaction:', error);
        res.status(500).json({ error: 'Failed to retrieve transaction' });
    }
}));
