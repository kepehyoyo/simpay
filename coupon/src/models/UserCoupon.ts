import mongoose from 'mongoose'; 
// An interface that describes the properties
// that are requried to create a new UserCoupon
interface UserCouponAttrs {
    UserCouponId: string;
    couponId: string;
    isRedeemed: boolean;
}

// An interface that describes the properties
// that a UserCoupon Model has
interface UserCouponModel extends mongoose.Model<UserCouponDoc> {
  build(attrs: UserCouponAttrs): UserCouponDoc;
}

// An interface that describes the properties
// that a UserCoupon Document has
interface UserCouponDoc extends mongoose.Document {
    UserCouponId: string;
    couponId: string;
    isRedeemed: boolean;
}

const userCouponSchema = new mongoose.Schema(
  {
    UserCouponId: {
        type: String,
        required: true,
      },
      couponId: {
        type: String,
        required: true,
      },
      isRedeemed: {
        type: Boolean,
        default: false,
      }
    
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


userCouponSchema.statics.build = (attrs: UserCouponAttrs) => {
  return new UserCoupon(attrs);
};

const UserCoupon = mongoose.model<UserCouponDoc, UserCouponModel>('UserCoupon', userCouponSchema);

export { UserCoupon };
