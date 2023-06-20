// Import required modules and define Express router
import express, { Request, Response } from 'express';

// Import the necessary models
import Customer from '../models/Customer';
import Reward from '../models/Reward';


const router = express.Router();

// Define the 'POST /api/loyalty/redeem' endpoint
router.post('/api/loyalty/redeem', redeemReward);


// Handle the 'POST /api/loyalty/redeem' request
async function redeemReward(req: Request, res: Response) {
  try {
    const { customerId, rewardId } = req.body;

    // Validate the request data
    if (!customerId || !rewardId) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Retrieve the customer from the database
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Retrieve the reward from the database
    const reward = await Reward.findById(rewardId);

    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    // Check if the customer has enough loyalty points to redeem the reward
    if (customer.loyaltyPoints < reward.pointCost) {
      return res.status(400).json({ error: 'Insufficient loyalty points' });
    }

    // Update the customer's loyalty points
    customer.loyaltyPoints -= reward.pointCost;

    // Save the updated customer data
    await customer.save();

    // Return a success response
    return res.json({ message: 'Reward redeemed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Export the router
export default router;