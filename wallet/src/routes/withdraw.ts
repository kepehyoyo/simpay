//withdrawning money from the wallet(Post)

/* Withdraw Money: This API endpoint allows the user to withdraw money from their wallet to their bank account.
Endpoint: /api/wallet/withdraw
Method: POST
Request Body: { "walletId": "wallet123", "amount": 300, "bankDetails": { "bankName": "ABC Bank", "accountNumber": "0987654321" } }
Response Body: { "walletId": "wallet123", "balance": 200 } */

import { validateRequest } from '@cygnetops/common-v2';
import express,{ Request, Response } from 'express';
import { body,param } from 'express-validator';/* 
import { KafkaProducer } from '../events/kafkaProducer'; */
import { Wallet } from '../models/wallet';
/* import { WithdrawMoneyEvent } from '../events/withdrawMoneyEvent';
import { WithdrawMoneyPublisher } from '../events/publishers/withdrawMoneyPublisher';
 */
const router = express.Router();


router.post("/api/wallet/withdraw",[
    body('wallet_id').isUUID(),
    body('amount').isFloat({ min: 0 }),
    validateRequest,
    ],async (req: Request, res: Response) => {

    
    const { wallet_id,amount } = req.body;

  try {
    // Check if the wallet exists
    const wallet = await Wallet.findOne({ wallet_id });
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
    await wallet.save();

/*     // Publish a withdraw money event
    const kafkaProducer = new KafkaProducer();
    const withdrawMoneyEvent = new WithdrawMoneyEvent({ walletId, amount });
    const withdrawMoneyPublisher = new WithdrawMoneyPublisher(kafkaProducer);
    await withdrawMoneyPublisher.publish(withdrawMoneyEvent);
 */
    return res.status(200).json({ message: 'Withdrawal successful' , balance :wallet.balance});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export {router as withdrawWalletRouter}
