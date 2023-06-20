import mongoose from 'mongoose'; 

export enum TransactionType{
    DEPOSIT   = "deposit",
    WITHDRAWAL = "withdrawal",
    TRANSFER   = "transfer",
    BILL_PAYMENT = "bill-payment"

}

export enum TransactionStatus {
  PENDING = "pending",
  SUCCESSFUL = "successful",
  FAILED = "failed"
}
// An interface that describes the properties
// that are requried to create a new Transaction
interface TransactionAttrs {
    _id: string;
    phoneNumber: string;
    type: TransactionType;
    amount: number;
    fees: number;
    status: TransactionStatus;
    timestamp: Date;
}

// An interface that describes the properties
// that a Transaction Model has
interface TransactionModel extends mongoose.Model<TransactionDoc> {
  build(attrs: TransactionAttrs): TransactionDoc;
}

// An interface that describes the properties
// that a Transaction Document has
interface TransactionDoc extends mongoose.Document {
    _id: string;
    phoneNumber: string;
    type: TransactionType;
    amount: number;
    fees: number;
    status: TransactionStatus;
    timestamp: Date;
}

const transactionSchema = new mongoose.Schema(
  {
    phoneNumber: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: Object.values(TransactionType),
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      fees: {
        type: Number,
        required: true,
        default: 0,
      },
      status: {
        type: String,
        enum: Object.values(TransactionStatus),
        required: true,
        default: TransactionStatus.PENDING,
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

 
transactionSchema.statics.build = (attrs: TransactionAttrs) => {
  return new Transaction(attrs);
};

const Transaction = mongoose.model<TransactionDoc, TransactionModel>('Transaction', transactionSchema);

export { Transaction };
