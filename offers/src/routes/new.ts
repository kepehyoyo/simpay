import express,{ Request, Response } from 'express';
import { Offer,OfferDoc ,OfferAttrs} from '../model/Offer';
import OfferService from '../services/offer-service';



const router = express.Router();
router.post('/api/offers/new', async (req: Request, res: Response) =>{
 
    const {
      title,
      merchantId,
      description,
      startDate,
      endDate,
      discountPercentage,
      minSpend,
      maxDiscount,
      products,
      categories,
      imageUrl,
      isActive,
    } = req.body;
    
      const offerAttrs: OfferAttrs = {
        title,
        merchantId,
        description,
        startDate,
        endDate,
        discountPercentage,
        minSpend,
        maxDiscount,
        products,
        categories,
        imageUrl,
        isActive}
  try {
          const   offer = await OfferService.createOffer(offerAttrs);
          res.status(201).json({ offer });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
      }
  });

  export {router as createOfferRouter}
  
