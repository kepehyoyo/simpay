import express, { Request, Response } from 'express';
import { Transaction } from '../models/transaction';

// Create an Express application
const router = express.Router();

// Define an API route to get the status of a transaction
router.get('/api/transactions/:transactionId/status', async (req: Request, res: Response) => {
  const { transactionId } = req.params;

  try {
    // Retrieve the transaction from the database
    const transaction = await Transaction.findOne({ transactionId });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Send the transaction status as a JSON response
    res.status(200).json({ transactionId:transaction.transactionId, status: transaction.transactionStatus });
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error('Failed to retrieve transaction:', error);
    res.status(500).json({ error: 'Failed to retrieve transaction' });
  }
});
 
export {router as getStatusRouter}