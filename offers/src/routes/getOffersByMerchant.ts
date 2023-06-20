import { validateRequest } from '@cygnetops/common-v2';
import express, { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { Offer, OfferDoc } from '../model/Offer';

// GET /offers/merchant
//body {merchantId}

const router = express.Router();

router.get('/offers/merchant',
  body('mechantId').isMongoId().withMessage('Invalid merchant ID'),
  validateRequest,
  async (req: Request, res: Response) => {

   try{
       const {merchantId} = req.body;

       const offers : OfferDoc[]=  await Offer.find({ merchantId})
     
        res.json(offers);
      }
      catch(err)  {
        console.error(err);
        res.status(500).send('Server error');
      };
  }
);

export {router as getOffersByMerchantRouter}
