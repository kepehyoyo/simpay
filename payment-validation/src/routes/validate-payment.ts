import express,{Request,Response} from 'express';
import { AccountType, VerificationLevel } from '../models/trasanctionLimit';
import { ValidationService } from '../services/validation-service';


const router = express.Router();

router.post('/validate-payment', async (req:Request, res:Response) => {
  try {
    const { userId, paymentAmount, paymentRecipient, paymentMethod } = req.body;
    
   const accountType = AccountType.CUSTOMER
   const verificationLevel = VerificationLevel.LEVEL_1
    // perform payment validation checks
    const isPaymentValid = await ValidationService.validatePayment(userId,
         paymentAmount,accountType,verificationLevel, paymentRecipient, paymentMethod);

    if (isPaymentValid) {
      // payment is valid, proceed with payment authorization
      res.status(200).json({ message: 'Payment is valid.' });
    } else {
      // payment is not valid, reject payment request
      res.status(400).json({ message: 'Payment is not valid.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while processing the payment.' });
  }
});

export {router as validatePaymentRouter}