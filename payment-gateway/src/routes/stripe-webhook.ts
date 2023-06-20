import { Router, Request, Response } from 'express';
import Stripe from 'stripe';

const router = Router();
const stripe = new Stripe('sk_test_51MiIzxEcj1TJHYYdXrPwVJA1ZUoJkNLkevtKPlAFyv35qyArNqzTsONqMxj4NWGUJGD4EA37iH6oaKIpYLQm2Vcz00alJ7EjHe', {
  apiVersion: '2022-11-15',
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_a20b9be9ba36eef95e8712b1d1a061fb064083d7cfe05923ab4fe7979f27d57a";

/* try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error('Stripe webhook secret is not defined');
    }
 */

router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig || '', endpointSecret);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const userId = paymentIntent.metadata.userId;
      const amount = paymentIntent.amount;

      // Update the user's wallet balance or perform any other necessary actions
      // based on the payment success event

      // Example: Update the user's wallet balance in your database
      
     /*  await User.updateOne({ _id: userId }, { $inc: { walletBalance: amount } }); */

      res.sendStatus(200);
    } else {
      // Handle other event types if needed
      res.sendStatus(200);
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(400);
  }
});

export default router;
