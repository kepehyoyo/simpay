/* import express,{Response,Request} from 'express'
import { TransactionService } from '../service/transaction-service';


const router = express.Router();

const transactionService = new TransactionService();
router.post('/transactions/payment-initiated', async (req:Request, res:Response) => {
    try {
      // Get the payment information from the request body
      const paymentInfo: PaymentInfo = req.body.paymentInfo;
  
      // Validate the payment information
      const isValid = await validatePaymentInfo(paymentInfo);
      if (!isValid) {
        return res.status(400).send('Invalid payment information');
      }
  
      // Proceed with the transaction
      const transaction = await transactionService.initiateTransaction(req.user, paymentInfo);
  
      // Return the transaction details
      res.json(transaction);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });

  export {router as InitiateTransactionRouter}
   */