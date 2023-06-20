import express, { Router, Request, Response, NextFunction } from 'express';
import { validateRequest } from '../middleware/validation';
import { authenticateUser } from '../middleware/authentication';
import { authorizeUser } from '../middleware/authorization';
import { createPullFundsTransaction } from './services/paymentService';

// Custom type that extends Request interface
interface AuthenticatedRequest extends Request {
  user: any; // Modify the type of 'user' property according to your actual user object structure
}

const router: Router = express.Router();

// Custom middleware for validating the request payload
router.post('/api/transactions', validateRequest, authenticateUser, authorizeUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Extract necessary data from the request
    const {
      acquirerCountryCode,
      acquiringBin,
      amount,
      cardAcceptor,
      senderCardExpiryDate,
      senderCurrencyCode,
      senderPrimaryAccountNumber,
      systemsTraceAuditNumber,
    } = req.body;

    // Call your payment service to create the pull funds transaction
    const transaction = await createPullFundsTransaction({
      acquirerCountryCode,
      acquiringBin,
      amount,
      cardAcceptor,
      senderCardExpiryDate,
      senderCurrencyCode,
      senderPrimaryAccountNumber,
      systemsTraceAuditNumber,
    });

    // Return the transaction response
    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error creating pull funds transaction:', error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

export { router as visaFundTransferPullRouter };
