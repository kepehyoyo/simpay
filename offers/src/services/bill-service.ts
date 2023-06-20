import { Bill, BillDoc } from "../model/Bill";
import { BillItem, BillItemDoc } from "../model/BillItem";
import { OfferDoc,OfferCategory } from "../model/Offer";
import OfferService from "./offer-service";

class BillService {
   
  async applyOffersToBill(bill: BillDoc): Promise<BillDoc> {
    const offers = await OfferService.getOffersByMerchant(bill.merchantId);

    const itemsToApplyOffers: BillItemDoc[] = [];

    for (const item of bill.items) {
      const eligibleOffers = this.getEligibleOffers(item, offers);

      if (eligibleOffers.length > 0) {
        const itemWithOfferApplied = this.applyOfferToItem(item, eligibleOffers);
        itemsToApplyOffers.push(itemWithOfferApplied);
      } else {
        itemsToApplyOffers.push(item);
      }
    }
    const updatedBill = Bill.build({
        ...bill,
        items: itemsToApplyOffers,
    }) ;
        return updatedBill;
  }

  private getEligibleOffers(item: BillItemDoc, offers: OfferDoc[]): OfferDoc[] {
    const eligibleOffers: OfferDoc[] = [];

    for (const offer of offers) {
      if (
      //  (!offer.categories || offer.categories.includes(item.category)) &&
        (!offer.products || offer.products.includes(item.productId)) &&
        (!offer.minSpend || item.totalPrice >= offer.minSpend)
      ) {
        eligibleOffers.push(offer);
      }
    }

    return eligibleOffers;
  }

  private applyOfferToItem(item: BillItemDoc, eligibleOffers: OfferDoc[]): BillItemDoc {
    const offer = eligibleOffers.reduce((prev, current) => {
      return prev.discountPercentage > current.discountPercentage ? prev : current;
    });

    const discountAmount = item.totalPrice * (offer.discountPercentage / 100);

    const updatedBillItem = BillItem.build({
        ...item,
        discountAmount,
        totalPrice: item.totalPrice - discountAmount,
        offerId: offer.id,
      });

    return updatedBillItem;
  }
}

export { BillService };
