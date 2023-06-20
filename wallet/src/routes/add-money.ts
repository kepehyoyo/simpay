//Adding money to the wallet (POST)
/* Add Money: This API endpoint allows the user to add money to their wallet using different payment methods such as net banking, credit/debit cards, or UPI.
Endpoint: /api/wallet/add-money
Method: POST
Request Body: { "walletId": "wallet123",
 "amount": 500, 
 "paymentMethod": "netbanking",
  "paymentDetails": { "bankName": "XYZ Bank", "accountNumber": "1234567890" } }
Response Body: { "walletId": "wallet123", "balance": 500 } */


import express,{ Request, Response } from 'express';
import { body,param } from 'express-validator';
/* import { KafkaProducer } from '../events/kafkaProducer';
import { AddMoneyEvent } from '../events/addMoneyEvent';
import { AddMoneyPublisher } from '../events/publishers/addMoneyPublisher';
*/
import { Wallet } from '../models/wallet';
import { validateRequest } from '@cygnetops/common-v2';
import { TransactionStatus, TransactionType } from '../models/transaction';
import { Transaction } from '../components/transaction';
const router = express.Router();

router.post("/api/wallet/:walletId/add-money",[
            param('walletId').isUUID(),
            body('amount').isFloat({ min: 0 }),
        ],
        validateRequest,
         async (req: Request, res: Response) => {
        
    const { amount } = req.body;
    const { walletId } = req.params;
    try {
      // Find the wallet and update its balance
     
    const wallet = await Wallet.findOne({ walletId});
   if(wallet) {
      const transaction = new Transaction(wallet);
      const newTransaction = await transaction.createTransaction(amount,TransactionType.CREDIT,TransactionStatus.SUCCESSFUL, 'Deposit from bank');
      return res.status(200).json({ transaction:newTransaction.transaction_id,
                                  transactionType:newTransaction.type,
                                 balance: wallet.balance ,
                                });
    }
    else {
      return res.status(404).json({ message: 'Wallet not found' });
    }

   /*  // Publish an add money event
    const kafkaProducer = new KafkaProducer();
    const addMoneyEvent = new AddMoneyEvent({ wallet_id, amount });
    const addMoneyPublisher = new AddMoneyPublisher(kafkaProducer);
    await addMoneyPublisher.publish(addMoneyEvent);
 */
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export {router as addMoneyWalletRouter}