import mongoose from 'mongoose';
 
// An interface that describes the properties
// that are requried to create a new Coupon
interface CouponAttrs {
    code: string;
  discountPercentage: number;
  maxUses: number;
  currentUses: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

// An interface that describes the properties
// that a Coupon Model has
interface CouponModel extends mongoose.Model<CouponDoc> {
  build(attrs: CouponAttrs): CouponDoc;
}

// An interface that describes the properties
// that a Coupon Document has
interface CouponDoc extends mongoose.Document {
    code: string;
  discountPercentage: number;
  maxUses: number;
  currentUses: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

const couponSchema = new mongoose.Schema(
  {
    code: {
        type: String,
        required: true
      },
      discountPercentage: {
        type: Number,
        required: true
      },
      maxUses: {
        type: Number,
        required: true
      },
      currentUses: {
        type: Number,
        default: 0
      },
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        required: true
      },
      isActive: {
        type: Boolean,
        required: true
      }
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

 

couponSchema.statics.build = (attrs: CouponAttrs) => {
  return new Coupon(attrs);
};

const Coupon = mongoose.model<CouponDoc, CouponModel>('Coupon', couponSchema);

export { Coupon };
