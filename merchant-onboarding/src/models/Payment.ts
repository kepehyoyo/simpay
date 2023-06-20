import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new Payment
interface PaymentAttrs {
    orderId: string;
    amount: number;
    status: string;
    paymentMethod: string;
    transactionId?: string;
    timestamp: Date;
}

// An interface that describes the properties
// that a Payment Model has
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

// An interface that describes the properties
// that a Payment Document has
interface PaymentDoc extends mongoose.Document {
    orderId: string;
    amount: number;
    status: string;
    paymentMethod: string;
    transactionId?: string;
    timestamp: Date;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String , required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String },
    timestamp: { type: Date, default: Date.now },
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


paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };
