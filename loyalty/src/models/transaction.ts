
import mongoose, { Schema, Document } from 'mongoose';

// Define the Transaction schema
export interface TransactionModel extends Document {
    customerId: string;
    amount: number;
  }
  
  const transactionSchema = new Schema({
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer'
    },
    amount: {
      type: Number,
      required: true
    }
  });
  
  const Transaction = mongoose.model<TransactionModel>('Transaction', transactionSchema);

export default { Transaction };
