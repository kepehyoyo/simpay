import mongoose from 'mongoose';
 
// An interface that describes the properties
// that are requried to create a new CouponCode
interface CouponCodeAttrs {
    code: string;
    description: string;
    discount: number;
    expirationDate: Date;
    minPurchaseAmount: number;
    maxUsageCount: number;
    usageCount: number;
}

// An interface that describes the properties
// that a CouponCode Model has
interface CouponCodeModel extends mongoose.Model<CouponCodeDoc> {
  build(attrs: CouponCodeAttrs): CouponCodeDoc;
}

// An interface that describes the properties
// that a CouponCode Document has
interface CouponCodeDoc extends mongoose.Document {
    code: string;
    description: string;
    discount: number;
    expirationDate: Date;
    minPurchaseAmount: number;
    maxUsageCount: number;
    usageCount: number;
}

const couponCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    discount: { type: Number, required: true, min: 0 },
    expirationDate: { type: Date, required: true },
    minPurchaseAmount: { type: Number, required: true, min: 0 },
    maxUsageCount: { type: Number, required: true, min: 0 },
    usageCount: { type: Number, required: true, default: 0 },
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
 
couponCodeSchema.statics.build = (attrs: CouponCodeAttrs) => {
  return new CouponCode(attrs);
};

const CouponCode = mongoose.model<CouponCodeDoc, CouponCodeModel>('CouponCode', couponCodeSchema);

export { CouponCode };
