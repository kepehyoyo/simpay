
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import OfferService from '../services/offer-service';

const router = express.Router();

router.get('/offers', async (req: Request, res: Response) => {
    try {
      const offers = await OfferService.getOffers();
      res.json(offers);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });

  export { router as getOffersRouter }