import { validateRequest } from '@cygnetops/common-v2';
import express,{ Request, Response } from 'express';
import { query,body } from 'express-validator';
import { Transaction, TransactionStatus, TransactionType } from '../models/transaction'; 
import { TransactionService } from '../service/transaction-service';

const router = express.Router();
const transactionValidation = [
    body('fromDate').isISO8601().toDate(),
    body('toDate').isISO8601().toDate(),
    body('page').optional().isInt({ min: 0 }),
    body('limit').optional().isInt({ min: 1, max: 100 }),
    body('sourceWalletId').optional(),
    body('destinationWalletId').optional(),
    //body('sourceWalletId').optional().isUUID('4'),
   // body('destinationWalletId').optional().isUUID('4'),
    body('status').optional().isIn(['pending', 'completed']),
    body('type').optional().isIn(['debit', 'credit']),
  ];
 router.post('/api/transactions/list', transactionValidation ,validateRequest, async (req: Request, res: Response) => {
  try {
    
    const {sourceWalletId, destinationWalletId,status,type,fromDate, toDate, page, limit} = req.body;
    console.log("i am here");
    // Convert query params to appropriate types    
    const parsedFromDate = fromDate ? new Date(Date.parse(fromDate as string)) : null;
    const parsedToDate = toDate ? new Date(Date.parse(toDate as string)) : null;
    const parsedPage = page ? parseInt(page as string, 10) : 1;
    const parsedLimit = limit ? parseInt(limit as string, 10) : 10;

    // Validate input params
    if (!sourceWalletId && !destinationWalletId) {
      return res.status(400).json({ error: 'Either sourceWalletId or destinationWalletId is required' });
    }

    // Build query object
    const query = {
      sourceWalletId: sourceWalletId ? sourceWalletId.toString() : null,
      destinationWalletId: destinationWalletId ? destinationWalletId.toString() : null,
      status: status ? status.toUpperCase() as TransactionStatus : null,
      type: type ? type.toUpperCase() as TransactionType : null,
      fromDate: parsedFromDate,
      toDate: parsedToDate,
      page: parsedPage,
      limit: parsedLimit,
    };

    // Call service to retrieve transactions
    const { transactions, count } = await TransactionService.findTransactions(query);

    // Return response with transaction data and pagination info
    res.json({
      transactions,
      count,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(count / parsedLimit),
    });
  } catch (error) {
    console.error('Error in listTransactions', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
);

export {router as listTransactionsRouter};