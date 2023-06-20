
import { Router, Request, Response } from 'express';
import Stripe from 'stripe';

const router = Router();
const stripe = new Stripe('sk_test_51MiIzxEcj1TJHYYdXrPwVJA1ZUoJkNLkevtKPlAFyv35qyArNqzTsONqMxj4NWGUJGD4EA37iH6oaKIpYLQm2Vcz00alJ7EjHe', {
  apiVersion: '2022-11-15',
});

router.post('/create-payment-intent', async (req: Request, res: Response) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount ,
      currency: 'XAF',
      automatic_payment_methods: {
        enabled: true,
      },
      // Add a metadata field to store additional information (e.g., user ID)
      metadata: {
       // userId: req.user.id, // Assuming you have user authentication
          userId: "djfjkdfj"
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

export  {router as StripePaymentIntentRouter};
