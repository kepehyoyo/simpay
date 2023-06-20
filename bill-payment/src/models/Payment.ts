import mongoose from 'mongoose'; 

// An interface that describes the properties
// that are requried to create a new Payment
interface PaymentAttrs {
    paymentId: string;
    amountPaid: number;
    paymentDate: Date;
    userId: string;
    billId: string;
}

// An interface that describes the properties
// that a Payment Model has
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

// An interface that describes the properties
// that a Payment Document has
interface PaymentDoc extends mongoose.Document {
    paymentId: string;
    amountPaid: number;
    paymentDate: Date;
    userId: string;
    billId: string;
}

const PaymentSchema = new mongoose.Schema(
  {
    paymentId:{ type: String, required: true },
    amountPaid: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    userId:  { type: String, required: true },
    billId: { type: String, required: true }
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

 
PaymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', PaymentSchema);

export { Payment };
