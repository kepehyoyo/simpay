import express, { Request, Response } from 'express';
import { validateRequest } from '@cygnetops/common-v2';
import { body, query } from 'express-validator';
import { Transaction, TransactionStatus, TransactionType } from '../models/transaction';
import { TransactionService } from '../service/transaction-service';

interface TransactionQuery {
  sourceWalletId: string | null;
  destinationWalletId: string | null;
  status: TransactionStatus | null;
  type: TransactionType | null;
  fromDate: Date | null;
  toDate: Date | null;
  page: number;
  limit: number;
}

const router = express.Router();

const transactionByIdValidation = [
  body('walletId').isUUID('4'),
  body('fromDate').optional().isISO8601().toDate(),
  body('toDate').optional().isISO8601().toDate(),
  body('page').optional().isInt({ min: 0 }),
  body('limit').optional().isInt({ min: 1, max: 100 }),
  body('status').optional().isIn(['pending', 'completed']),
  body('type').optional().isIn(['debit', 'credit']),
];

router.post('/api/transactions/wallet', transactionByIdValidation, async (req: Request, res: Response) => {
 try {
    const { walletId } = req.body;
    const { fromDate, toDate, page, limit, status, type } = req.body;

    // Convert query params to appropriate types
    const parsedFromDate = fromDate ? new Date(Date.parse(fromDate as string)) : null;
    const parsedToDate = toDate ? new Date(Date.parse(toDate as string)) : null;
    const parsedPage = page ? parseInt(page as string, 10) : 1;
    const parsedLimit = limit ? parseInt(limit as string, 10) : 10;

    // Build query object
    const query: TransactionQuery = {
      sourceWalletId: walletId,
      destinationWalletId: walletId,
      status: status ? status.toUpperCase() as TransactionStatus : null,
      type: type ? type.toUpperCase() as TransactionType : null,
      fromDate: parsedFromDate,
      toDate: parsedToDate,
      page: parsedPage,
      limit: parsedLimit,
    };

    // Call service to retrieve transactions
    const { transactions, count } = await TransactionService.findTransactionsbyId(query);
    console.log("someone is fetching transactions, cheecky,cheecky!")
  
    // Return response with transaction data and pagination info
    res.json({
      transactions
    /*   count,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(count / parsedLimit), */
    });
  } catch (error) {
    console.error('Error in getTransactionsById', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as transactionByIdRouter };
