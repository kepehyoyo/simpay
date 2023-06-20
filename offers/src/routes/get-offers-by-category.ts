import express, { Request, Response } from 'express';
import OfferService from '../services/offer-service';
import { body, validationResult } from 'express-validator';
import { validateRequest } from '@cygnetops/common-v2';

const router = express.Router(); ;

router.get(
  '/offers/category',
  [
    body('category')
      .notEmpty()
      .withMessage('Category is required')
      .isIn(['food', 'travel', 'entertainment'])
      .withMessage('Invalid category')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    
    const {category} = req.body;

    try {
      const offers = await OfferService.getOffersByCategory(category);
      res.json(offers);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

export { router as offerbyCategoryRouter };
