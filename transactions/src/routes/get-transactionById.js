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
exports.transactionByIdRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const transaction_service_1 = require("../service/transaction-service");
const router = express_1.default.Router();
exports.transactionByIdRouter = router;
const transactionByIdValidation = [
    (0, express_validator_1.body)('walletId').isUUID('4'),
    (0, express_validator_1.body)('fromDate').optional().isISO8601().toDate(),
    (0, express_validator_1.body)('toDate').optional().isISO8601().toDate(),
    (0, express_validator_1.body)('page').optional().isInt({ min: 0 }),
    (0, express_validator_1.body)('limit').optional().isInt({ min: 1, max: 100 }),
    (0, express_validator_1.body)('status').optional().isIn(['pending', 'completed']),
    (0, express_validator_1.body)('type').optional().isIn(['debit', 'credit']),
];
router.post('/api/transactions/wallet', transactionByIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { walletId } = req.body;
        const { fromDate, toDate, page, limit, status, type } = req.body;
        // Convert query params to appropriate types
        const parsedFromDate = fromDate ? new Date(Date.parse(fromDate)) : null;
        const parsedToDate = toDate ? new Date(Date.parse(toDate)) : null;
        const parsedPage = page ? parseInt(page, 10) : 1;
        const parsedLimit = limit ? parseInt(limit, 10) : 10;
        // Build query object
        const query = {
            sourceWalletId: walletId,
            destinationWalletId: walletId,
            status: status ? status.toUpperCase() : null,
            type: type ? type.toUpperCase() : null,
            fromDate: parsedFromDate,
            toDate: parsedToDate,
            page: parsedPage,
            limit: parsedLimit,
        };
        // Call service to retrieve transactions
        const { transactions, count } = yield transaction_service_1.TransactionService.findTransactionsbyId(query);
        console.log("someone is fetching transactions, cheecky,cheecky!");
        // Return response with transaction data and pagination info
        res.json({
            transactions
            /*   count,
              page: parsedPage,
              limit: parsedLimit,
              totalPages: Math.ceil(count / parsedLimit), */
        });
    }
    catch (error) {
        console.error('Error in getTransactionsById', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
