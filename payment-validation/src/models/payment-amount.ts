import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new PaymentAmount
interface PaymentAmountAttrs {
  walletId:string;
  date: Date;
  amount: number;
}

// An interface that describes the properties
// that a PaymentAmount Model has
interface PaymentAmountModel extends mongoose.Model<PaymentAmountDoc> {
  build(attrs: PaymentAmountAttrs): PaymentAmountDoc;
}

// An interface that describes the properties
// that a PaymentAmount Document has
interface PaymentAmountDoc extends mongoose.Document {
  walletId:string;
  date: Date;
  amount: number;
}

const paymentAmountSchema = new mongoose.Schema(
  {
  walletId: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true }
  },
  {
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
  }
);

 
paymentAmountSchema.statics.build = (attrs: PaymentAmountAttrs) => {
  return new PaymentAmount(attrs);
};

const PaymentAmount = mongoose.model<PaymentAmountDoc, PaymentAmountModel>('PaymentAmount', paymentAmountSchema);

export { PaymentAmount ,PaymentAmountDoc};


