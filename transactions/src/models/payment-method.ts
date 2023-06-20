import mongoose from 'mongoose';





export type PaymentType = 'mobile_money' | 'card' | 'bank_account' | 'wallet';

 
// An interface that describes the properties
// that are requried to create a new PaymentMethod
interface PaymentMethodAttrs {
    name: string;
    type: PaymentType;
    cardBrand?: string;
    last4Digits?: string;
    bankName?: string;
    bankAccountType?: string;
    bankRoutingNumber?: string;
    bankAccountNumber?: string;
    walletId?: string;
    mobileMoneyProvider?: string;
    mobileMoneyNumber?: string;
}

// An interface that describes the properties
// that a PaymentMethod Model has
interface PaymentMethodModel extends mongoose.Model<PaymentMethodDoc> {
  build(attrs: PaymentMethodAttrs): PaymentMethodDoc;
}

// An interface that describes the properties
// that a PaymentMethod Document has
interface PaymentMethodDoc extends mongoose.Document {
    name: string;
    type: PaymentType;
    cardBrand?: string;
    last4Digits?: string;
    bankName?: string;
    bankAccountType?: string;
    bankRoutingNumber?: string;
    bankAccountNumber?: string;
    walletId?: string;
    mobileMoneyProvider?: string;
    mobileMoneyNumber?: string;
}

const paymentMethodSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['mobile_money', 'card', 'bank_account', 'wallet'],
      required: true,
    },
    cardBrand: {
      type: String,
    },
    last4Digits: {
      type: String,
    },
    bankName: {
      type: String,
    },
    bankAccountType: {
      type: String,
    },
    bankRoutingNumber: {
      type: String,
    },
    bankAccountNumber: {
      type: String,
    },
    walletId: {
      type: String,
    },
    mobileMoneyProvider: {
      type: String,
    },
    mobileMoneyNumber: {
      type: String,
    },
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

 
paymentMethodSchema.statics.build = (attrs: PaymentMethodAttrs) => {
  return new PaymentMethod(attrs);
};

const PaymentMethod = mongoose.model<PaymentMethodDoc, PaymentMethodModel>('PaymentMethod', paymentMethodSchema);

export { PaymentMethod,PaymentMethodDoc };
