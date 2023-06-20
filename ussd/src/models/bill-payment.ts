import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new BillPayment
interface BillPaymentAttrs {
    _id: string;
    billId: string;
    BillPaymentId: string;
    status: BillPaymentStatus;
    timestamp: Date;
}

// An interface that describes the properties
// that a BillPayment Model has
interface BillPaymentModel extends mongoose.Model<BillPaymentDoc> {
  build(attrs: BillPaymentAttrs): BillPaymentDoc;
}

// An interface that describes the properties
// that a BillPayment Document has
interface BillPaymentDoc extends mongoose.Document {
    _id: string;
    billId: string;
    BillPaymentId: string;
    status: BillPaymentStatus;
    timestamp: Date;
}

const billPaymentSchema = new mongoose.Schema(
  {
    billId: {
        type: String,
        required: true,
      },
      BillPaymentId: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        required: true,
        default: 'PENDING',
      },
      timestamp: {
        type: Date,
        required: true,
        default: Date.now,
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

 

billPaymentSchema.statics.build = (attrs: BillPaymentAttrs) => {
  return new BillPayment(attrs);
};

const BillPayment = mongoose.model<BillPaymentDoc, BillPaymentModel>('BillPayment', billPaymentSchema);

export { BillPayment };
