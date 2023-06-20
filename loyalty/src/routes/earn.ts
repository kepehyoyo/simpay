// Import required modules and define Express router
import express, { Request, Response } from 'express'; 
import mongoose from 'mongoose';

// Import the necessary models
import Customer from '../models/Customer';
import Transaction from '../models/Transaction';

const router = express.Router();

// Define the 'POST /api/loyalty/earn' endpoint
router.post('/api/loyalty/earn', earnLoyaltyPoints);


// Handle the 'POST /api/loyalty/earn' request
async function earnLoyaltyPoints(req: Request, res: Response) {
  try {
    const { customerId, amount } = req.body;

    // Validate the request data
    if (!customerId || !amount) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Retrieve the customer from the database
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Create a new transaction record
    const transaction = new Transaction({
      customerId,
      amount
    });

    // Save the transaction to the database
    await transaction.save();

    // Update the customer's loyalty points
    customer.loyaltyPoints += amount;

    // Save the updated customer data
    await customer.save();

    // Return a success response
    return res.json({ message: 'Loyalty points earned successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default router;