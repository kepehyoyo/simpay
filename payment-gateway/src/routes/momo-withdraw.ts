import express, { Request, Response } from 'express';
import { mtnMomoService } from '../services/mtn-momo';

const router = express.Router();

// Define a route for mobile money withdraw
router.post('/api/payment-gateway/momo/withdraw', async (req: Request, res: Response) => {
  // Extract necessary data from the request body
  const { phoneNumber, amount, currency, message, payeeNote } = req.body;

  // Verify the phone number and determine the mobile money provider
  let provider: string;
  if (
    phoneNumber.startsWith('23767') ||
    phoneNumber.startsWith('23768') ||
    phoneNumber.startsWith('237650') ||
    phoneNumber.startsWith('237651') ||
    phoneNumber.startsWith('237652') ||
    phoneNumber.startsWith('237653') ||
    phoneNumber.startsWith('237654')
  ) {
    provider = 'MTN';
  } else if (
    phoneNumber.startsWith('23769') ||
    phoneNumber.startsWith('237655') ||
    phoneNumber.startsWith('237656') ||
    phoneNumber.startsWith('237657') ||
    phoneNumber.startsWith('237658') ||
    phoneNumber.startsWith('237659')
  ) {
    provider = 'Orange';
  } else {
    return res.json({ success: false, message: 'Invalid phone number' });
  }

  // Perform the mobile money withdraw logic based on the provider
  if (provider === 'MTN') {
    try {
      // Validate the phone number or perform any necessary checks

      // Connect to the MTN mobile money service or use an API client library

      // Perform the withdraw request to the MTN mobile money service
      const referenceId = await mtnMomoService.requestToWithdraw(amount,phoneNumber,payeeNote,message)

      // Check the response from the MTN mobile money service
      if (referenceId) {
        // Withdraw was successful

        // Perform any additional post-processing or logging

        // Return a success response
        return res.json({ success: true, message: `Mobile money withdraw successful with referenceId ${referenceId}` });
      } else {
        // Withdraw failed

        // Perform any necessary error handling or logging

        // Return an error response
        return res.status(500).json({ success: false, message: 'Error processing mobile money withdraw' });
      }
    } catch (error) {
      // Error occurred during the withdraw process

      // Perform any necessary error handling or logging

      // Return an error response
      return res.status(500).json({ success: false, message: 'Error processing mobile money withdraw' });
    }
  } else if (provider === 'Orange') {
    // Process the withdraw using Orange mobile money service
    try {
      // Validate the phone number or perform any necessary checks

      // Connect to the Orange mobile money service or use an API client library

      // Perform the withdraw request to the Orange mobile money service
      /* const withdrawResponse = await OrangeMomoService.withdraw(phoneNumber, amount);

      // Check the response from the Orange mobile money service
      if (withdrawResponse.success) {
        // Withdraw was successful

        // Perform any additional post-processing or logging

        // Return a success response
        res.json({ success: true, message: 'Mobile money withdraw successful' });
      } else {
        // Withdraw failed

        // Perform any necessary error handling or logging

        // Return an error response
        res.status(500).json({ success: false, message: 'Error processing mobile money withdraw' });
      } */
    } catch (error) {
      // Error occurred during the withdraw process

      // Perform any necessary error handling or logging

      // Return an error response
      res.status(500).json({ success: false, message: 'Error processing mobile money withdraw' });
    }
  } else {
    return res.json({ success: false, message: 'Invalid mobile money provider' });
  }
});

export { router as momoWithdrawRouter };
