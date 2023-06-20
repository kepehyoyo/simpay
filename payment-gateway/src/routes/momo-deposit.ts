import express, { Request, Response } from 'express';
import { mtnMomoService } from '../services/mtn-momo';

const router = express.Router();

// Define a route for mobile money top-up
router.post('/api/payment-gateway/momo/top-up',async (req: Request, res: Response) => {
  // Extract necessary data from the request body
  const { phoneNumber, amount,currency,message,payeeNote } = req.body;
 
  // Verify the phone number and determine the mobile money provider
  let provider: string;
  if ( phoneNumber.startsWith('23767') ||
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

  // Perform the mobile money top-up logic based on the provider
  if (provider === 'MTN') {
    try {
      // Validate the phone number or perform any necessary checks

      // Connect to the MTN mobile money service or use an API client library

      // Perform the top-up request to the MTN mobile money service
      const referenceId = await mtnMomoService.requestToPay(amount, phoneNumber, currency, message, payeeNote);

    
      // Check the response from the MTN mobile money service
      if (referenceId) {
        // Top-up was successful
        console.log('Successful');
        // Perform any additional post-processing or logging

        // Return a success response
        return res.json({ success: true, message:`Mobile money top-up successful with referenceId ${referenceId}`});
      } else {
        // Top-up failed

        // Perform any necessary error handling or logging

        // Return an error response
        return res.status(500).json({ success: false, message: 'Error processing mobile money top-up' });
      }
    } catch (error) {
      // Error occurred during the top-up process

      // Perform any necessary error handling or logging

      // Return an error response
      return res.status(500).json({ success: false, message: 'Error processing mobile money top-up' });
    }
  } else if (provider === 'Orange') {
    // Process the top-up using Orange mobile money service
 // Your logic for processing the top-up using the MTN mobile money service goes here
try {
    // Validate the phone number or perform any necessary checks
    
    // Connect to the MTN mobile money service or use an API client library
    
    // Perform the top-up request to the MTN mobile money service
   /*  const topUpResponse = await OrangeMomoService.topUp(phoneNumber,amount)
    
    // Check the response from the MTN mobile money service
    if (topUpResponse.success) {
      // Top-up was successful
      
      // Perform any additional post-processing or logging
      
      // Return a success response
      res.json({ success: true, message: 'Mobile money top-up successful' });
    } else {
      // Top-up failed
      
      // Perform any necessary error handling or logging
      
      // Return an error response
      res.status(500).json({ success: false, message: 'Error processing mobile money top-up' });
    } */
  } catch (error) {
    // Error occurred during the top-up process
    
    // Perform any necessary error handling or logging
    
    // Return an error response
    res.status(500).json({ success: false, message: 'Error processing mobile money top-up' });
  }
  } else {
    return res.json({ success: false, message: 'Invalid mobile money provider' });
  }
});
 
export {router as momoAddRouter}