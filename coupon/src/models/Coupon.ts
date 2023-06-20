import mongoose from 'mongoose';
 

enum CouponType {
    PERCENTAGE = 'percentage',
    FIXED = 'fixed',
  }
// An interface that describes the properties
// that are requried to create a new Coupon
interface CouponAttrs {
    code: string;
    type: CouponType;
    value: number;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
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
    type: CouponType;
    value: number;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    type: { type: String, enum:Object.values(CouponType), required: true },
    value: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    },
    timestamps: true,
  }
);

 
couponSchema.statics.build = (attrs: CouponAttrs) => {
  return new Coupon(attrs);
};

const Coupon = mongoose.model<CouponDoc, CouponModel>('Coupon', couponSchema);

export { Coupon };
