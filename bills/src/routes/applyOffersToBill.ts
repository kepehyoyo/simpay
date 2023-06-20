// Import required modules
import express from 'express';
import { Bill } from '../models/Bill';
import { BillService } from '../services copy/bill-service';

 const billService = new BillService();
// Create an instance of the express router
const router = express.Router();

// Define a route for applying offers to a bill
router.post('/bills/:id/offers', async (req, res) => {
  try {
    // Get the bill id from the request parameters
    const billId = req.params.id;
   
    const bill = await Bill.findById(billId);
    // Call the BillService to apply offers to the bill
   if(bill) {
    const updatedBill = await billService.applyOffersToBill(bill);

    // Return the updated bill as a response
    res.json(updatedBill);
    }
    else {
        return res.status(404).json({ message: 'Bill not found' });
      }
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the router
export default router;

