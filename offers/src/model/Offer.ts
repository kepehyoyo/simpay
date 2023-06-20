import mongoose from 'mongoose';
import { OfferCategory, OfferCategoryDoc } from './OfferCategory';
 
 
 
// An interface that describes the properties
// that are requried to create a new Offer
export interface OfferAttrs {
    title: string;
    merchantId :string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    discountPercentage: number;
    minSpend?: number;
    maxDiscount?: number;
    products?: string[];
    categories?: OfferCategoryDoc[];
    imageUrl?: string;
    isActive: boolean;
}

// An interface that describes the properties
// that a Offer Model has
interface OfferModel extends mongoose.Model<OfferDoc> {
  build(attrs: OfferAttrs): OfferDoc;
}

// An interface that describes the properties
// that a Offer Document has
interface OfferDoc extends mongoose.Document {
    title: string;
    merchantId :string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    discountPercentage: number;
    minSpend?: number;
    maxDiscount?: number;
    products?: string[];
    categories?: OfferCategoryDoc[];
    imageUrl?: string;
    isActive: boolean;
}

const offerSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true,
      },
      merchantId: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
      },
      discountPercentage: {
        type: Number,
        required: true,
      },
      minSpend: {
        type: Number,
      },
      maxDiscount: {
        type: Number,
      },
      products: {
        type: [String],
      },
      category: {
        type: [OfferCategory],
        required: true,
      },
      imageUrl: { type: String },
      isActive: {
        type: Boolean,
        required: true,
        default: true,
      },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);
 

offerSchema.statics.build = (attrs: OfferAttrs) => {
  return new Offer(attrs);
};

const Offer = mongoose.model<OfferDoc, OfferModel>('Offer', offerSchema);

export { Offer ,OfferDoc};
