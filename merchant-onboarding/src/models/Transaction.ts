import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new Transaction
interface TransactionAttrs {
    merchantId: string;
    customerId: string;
    orderId: string;
    paymentId: string;
    amount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

// An interface that describes the properties
// that a Transaction Model has
interface TransactionModel extends mongoose.Model<TransactionDoc> {
  build(attrs: TransactionAttrs): TransactionDoc;
}

// An interface that describes the properties
// that a Transaction Document has
interface TransactionDoc extends mongoose.Document {
    merchantId: string;
    customerId: string;
    orderId: string;
    paymentId: string;
    amount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema = new mongoose.Schema(
  {
    merchantId: { type: String, required: true },
    customerId: { type: String, required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
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

 
transactionSchema.statics.build = (attrs: TransactionAttrs) => {
  return new Transaction(attrs);
};

const Transaction = mongoose.model<TransactionDoc, TransactionModel>('Transaction', transactionSchema);

export { Transaction };
