import mongoose from "mongoose";

 enum TransactionType {
    DEBIT = "debit",
    CREDIT = "credit",
    TRANSFER = "transfer"
  }
  
  export enum TransactionStatus {
    INITIATED = 'initiated',
    VALIDATED = 'validated',
    AUTHORIZED = 'authorized',
    COMPLETED = 'completed',
    PENDING = "pending",
    SUCCESS = 'success',
    APPROVED = 'approved',
    FAILURE = 'failure',
    SUCCESSFUL = "successful",
    REJECTED = 'rejected',
    FAILED = "failed" 
  }
//An interface that describes the properties that
// are required to create a new Wallet
  interface TransactionAttrs {
    transactionId: string;
    sourceWalletId: string;
    destinationWalletId: string;
    transactionType: TransactionType;
    transactionAmount: number;
    transactionCurrency: string;
    transactionFee: number;
    transactionStatus: TransactionStatus;
  
    transactionDescription: string;
    metadata?: Record<string, any>;
}


//An interface which describes the properties 
//that a Wallet Model has
interface TransactionModel extends mongoose.Model<TransactionDoc> {
      build(attrs:TransactionAttrs): TransactionDoc;
  }
  
//An interface that describes the properties
//that a Wallet Document has
interface TransactionDoc extends mongoose.Document{
            transactionId: string;
            sourceWalletId: string;
            destinationWalletId: string;
            transactionType: TransactionType;
            transactionAmount: number;
            transactionCurrency: string;
            transactionFee: number;
            transactionStatus: TransactionStatus;
            transactionDate: Date;
            transactionDescription: string;
            metadata?: Record<string, any>;
        }

  const transactionSchema = new mongoose.Schema ({ 
    transactionId: { type: String, required: true,  unique: true,  },
    sourceWalletId: { type: String,required: true, },
    destinationWalletId: {type: String, required: true,},
    transactionType: {type: String, required: true,  enum: Object.values(TransactionType), },
    transactionAmount: { type: Number,    required: true,   },
    transactionCurrency: { type: String,  required: true, },
    transactionFee: { type: Number,  required: true,  },
    transactionStatus: { type: String, required: true, enum: Object.values(TransactionStatus),  },
    transactionDate: { type: Date, required: true, default: Date.now},
    transactionDescription: {  type: String,  required: true, },
    metadata: { type: Object,  required: false, },
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
 
  transactionSchema.statics.build = (attrs:TransactionAttrs) =>{
    return new Transaction(attrs)
  }
  
  const Transaction = mongoose.model<TransactionDoc,TransactionModel>('Transaction',transactionSchema);

  export {Transaction,TransactionDoc,TransactionType};