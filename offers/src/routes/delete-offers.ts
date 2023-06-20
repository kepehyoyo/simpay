import { validateRequest } from '@cygnetops/common-v2';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Offer } from '../model/Offer';
import OfferService from '../services/offer-service';

const router = express.Router();

router.delete('/offers/:id', [  
 //Validate the user id parameter
body("OfferId").notEmpty().withMessage("Offer ID is required"),
] ,
validateRequest,async (req: Request, res: Response) => {
    const {offerId} = req.body
    
  const offer = await Offer.findById(offerId);

  if (!offer) {
    return res.status(404).send({ error: 'Offer not found' });
  }

  try {
    await OfferService.deleteOffer(offerId);
    res.status(204).send({message:'Offer deleted successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

export { router as deleteOfferRouter };
