//Transferring money from the wallet (POST)

/* Transfer Money: This API endpoint allows the user to transfer money from their wallet to another user's wallet.
Endpoint: /api/wallet/transfer
Method: POST
Request Body: { "fromWalletId": "wallet123", "toWalletId": "wallet456", "amount": 200 }
Response Body: { "fromWalletId": "wallet123", "toWalletId": "wallet456", "amount": 200 } */

import { validateRequest } from '@cygnetops/common-v2';
import express,{ Request, Response } from 'express';
/* import { KafkaProducer } from '../events/kafkaProducer';
import { TransferMoneyEvent } from '../events/transferMoneyEvent';
import { TransferMoneyPublisher } from '../events/publishers/transferMoneyPublisher';
*/
import { body } from 'express-validator';
import { Transaction } from '../components/transaction';
import { TransactionStatus, TransactionType } from '../models/transaction';
import { Wallet } from '../models/wallet';



const router = express.Router();

router.post ("/api/wallet/transfer-money",[
          body("senderWallet_id").notEmpty().withMessage("Sender ID is required"),
          body("receiverWallet_id").notEmpty().withMessage("Reviever ID is required"),
          body('amount').isFloat({ min: 0 }), 
          validateRequest,
    ],async (req: Request, res: Response) => {
       
       
        const { senderWallet_id, receiverWallet_id, amount } = req.body;

        try {
            // Find sender and receiver wallets
            const senderWallet = await Wallet.findOne({ wallet_id: senderWallet_id });
            const receiverWallet = await Wallet.findOne({ wallet_id: receiverWallet_id });

            if (!senderWallet || !receiverWallet) {
            return res.status(400).json({ message: 'Invalid wallet IDs' });
            }

            // Check if sender has enough balance
            if (senderWallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
            }

            // Deduct amount from sender wallet and add to receiver wallet
            const senderTransaction = new Transaction(senderWallet);
            const receiverTransaction = new Transaction(receiverWallet);
            
            const newSenderTransaction = await senderTransaction.createTransaction(amount,TransactionType.DEBIT,TransactionStatus.SUCCESSFUL, receiverWallet_id)
            const newReceiverTransaction = await receiverTransaction.createTransaction(amount,TransactionType.CREDIT,TransactionStatus.SUCCESSFUL, senderWallet_id)
            
            

           /*  // Publish a transfer money event
            const kafkaProducer = new KafkaProducer();
            const transferMoneyEvent = new TransferMoneyEvent({
            senderWalletId,
            receiverWalletId,
            amount,
            });
            const transferMoneyPublisher = new TransferMoneyPublisher(kafkaProducer);
            await transferMoneyPublisher.publish(transferMoneyEvent); */

            return res.status(200).json({ sender_balance:senderWallet.balance,receiver_balance:receiverWallet.balance });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
});

export {router as transferMoneyWalletRouter}