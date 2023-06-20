//view transactions from wallet (GET)

/* Get Transaction History: This API endpoint retrieves the transaction history of the user's digital wallet.
Endpoint: /api/wallet/transactions
Method: GET
Request Body: { "walletId": "wallet123" }
Response Body: { "transactions": 
[ { "transactionId": "txn123", "amount": 500, "type": "credit", "description": "Added money to wallet", "timestamp":
 "2022-03-15T10:30:00Z" } ] } */

 // src/controllers/walletController.ts

import { validateRequest } from '@cygnetops/common-v2';
import express,{ Request, Response } from 'express';
import { param } from 'express-validator';
import { Transaction } from '../models/transaction';

const router = express.Router();

router.get("/api/wallet/:wallet_id/transactions",[ param('wallet_id').isUUID()],validateRequest,
             async (req: Request, res: Response) => {
 
  const { wallet_id } = req.params;

  try {
    // Find transactions for the given wallet ID
    const transactions = await Transaction.find({ wallet_id }).sort({ createdAt: -1 });

    return res.status(200).json({ transactions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export {router as transactionsWalletRouter};
