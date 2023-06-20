// Checking wallet balance (GET)

/* Get Wallet Balance: This API endpoint retrieves the current balance of the user's digital wallet.
Endpoint: /api/wallet/balance
Method: GET
Request Body: { "walletId": "wallet123" }
Response Body: { "walletId": "wallet123", "balance": 500 } */

import express,{ Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { Wallet } from '../models/wallet';

const router = express.Router();



router.get("/api/wallet/user/:userId/balance",async (req: Request, res: Response) => {
 
   
  //await check('user_id').isUUID().run(req);

 // const errors = validationResult(req);

  /* if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } */

  const { userId } = req.params;
  try {
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    return res.json({ walletId:wallet.walletId, balance:wallet.balance});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export {router as checkUserWalletBalanceRouter}