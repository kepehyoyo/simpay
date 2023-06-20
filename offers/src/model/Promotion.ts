 

import mongoose from 'mongoose'; 

// An interface that describes the properties
// that are requried to create a new Promotion
export interface PromotionAttrs {
    merchantId: string;
    name: string;
    startDate: Date;
    endDate: Date;
    discountPercentage: number;
    products: string[];
    categories: string[]
}

// An interface that describes the properties
// that a Promotion Model has
interface PromotionModel extends mongoose.Model<PromotionDoc> {
  build(attrs: PromotionAttrs): PromotionDoc;
}

// An interface that describes the properties
// that a Promotion Document has
interface PromotionDoc extends mongoose.Document {
    merchantId: string;
    name: string;
    startDate: Date;
    endDate: Date;
    discountPercentage: number;
    products: string[];
    categories: string[]
}

const promotionSchema = new mongoose.Schema(
  {
    merchantId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Merchant',
      },
      name: {
        type: String,
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      discountPercentage: {
        type: Number,
        required: true,
      },
      products: [{
        type: mongoose.Types.ObjectId,
        ref: 'Product',
      }],
      categories: [{
        type: mongoose.Types.ObjectId,
        ref: 'Category',
      }],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id; 
        delete ret.__v;
      }
    }
  }
);

 
promotionSchema.statics.build = (attrs: PromotionAttrs) => {
  return new Promotion(attrs);
};

const Promotion = mongoose.model<PromotionDoc, PromotionModel>('Promotion', promotionSchema);

export { Promotion,PromotionDoc };
