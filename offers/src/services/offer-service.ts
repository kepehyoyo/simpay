

import { Offer,OfferDoc,OfferAttrs } from "../model/Offer";
import { OfferCategoryDoc } from "../model/OfferCategory";
import { PromotionDoc,Promotion, PromotionAttrs } from "../model/Promotion";

class OfferService {
  static async getOffers(): Promise<OfferDoc[]> {
    const offers = await Offer.find({});
    return offers;
  }

  static async getOfferById(id: string): Promise<OfferDoc | null> {
    const offer = await Offer.findById(id);
    return offer;
  }

  static async createOffer(offerAttrs: OfferAttrs): Promise<OfferDoc> {
    const offer = Offer.build(offerAttrs);
    await offer.save();
    return offer;
  }

  static async deleteOffer(id: string): Promise<void> {
    await Offer.findByIdAndDelete(id);
  }

  static async getOffersByMerchant(merchantId: string): Promise<OfferDoc[]> {
    const offers = await Offer.find({ merchantId });
    return offers;
  }

  static async getOffersByCategory(category: OfferCategoryDoc): Promise<OfferDoc[]> {
    const offers = await Offer.find({ categories: category })
    return offers;
  }
  
  static async activateOffer(id: string): Promise<OfferDoc> {
    const offer = await Offer.findById(id);
    if (!offer) {
      throw new Error('Offer not found');
    }
    offer.isActive = true;
    await offer.save();
    return offer;
  }

  static async deactivateOffer(id: string): Promise<OfferDoc> {
    const offer = await Offer.findById(id);
    if (!offer) {
      throw new Error('Offer not found');
    }
    offer.isActive = false;
    await offer.save();
    return offer;
  }
  static async createPromotion(promotion: PromotionAttrs): Promise<PromotionDoc> {
    try{
      const newPromotion = await Promotion.build(promotion).save();
      return new Promotion ;
    }
    catch{
      throw new Error('Promotion could not be saved');
    }
   
  }
}

export default OfferService;
