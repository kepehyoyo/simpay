import express from 'express';
import OfferService from '../services/offer-service';
import { Promotion,PromotionAttrs } from '../model/Promotion';
import { body } from 'express-validator';
import { validateRequest } from '@cygnetops/common-v2';

const router = express.Router();
const offerService = new OfferService();

router.post('/promotions',body('promotionData') .notEmpty()
.withMessage('promotionId is required'),validateRequest, async (req, res) => {
  try {
    // Get the promotion data from the request body
    const { merchantId,
        name,
        startDate,
        endDate,
        discountPercentage,
        products,
        categories}= req.body;
      
        const newPromo :PromotionAttrs =  { 
            merchantId,
            name,
            startDate,
            endDate,
            discountPercentage,
            products,
            categories};
    // Call the offer service to create the promotion
    const createdPromotion = await OfferService.createPromotion(newPromo);

    // Return the created promotion as a response
    res.json(createdPromotion);
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
