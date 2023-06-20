import mongoose from "mongoose";



export enum TransactionType {
    DEBIT = 'DEBIT',
    CREDIT = 'CREDIT',
  }
  
export enum TransactionStatus {
    PENDING = "pending",
    SUCCESSFUL = "successful",
    FAILED = "failed"
  }
//An interface that describes the properties that
// are required to create a new Wallet
  interface TransactionAttrs {
      transaction_id: string;
      wallet_id: string;
      type : TransactionType;
      transactionStatus: TransactionStatus;
      amount: number;
      description?:string;
}

//An interface which describes the properties 
//that a Wallet Model has
interface TransactionModel extends mongoose.Model<TransactionDoc> {
      build(attrs:TransactionAttrs): TransactionDoc;
  }
  
//An interface that describes the properties
//that a Wallet Document has
interface TransactionDoc extends mongoose.Document{
    transaction_id: string;
    wallet_id: string;
    type : TransactionType;
    transactionStatus: TransactionStatus;
    amount: number;
    created_at: string;
    description:string;
}

  const transactionSchema = new mongoose.Schema ({ 
    transaction_id: { type: String, required: true ,unique:true},
    wallet_id: { type: String, required: true },
    type : { type: String, enum: Object.values(TransactionType), required: true },
    transactionStatus: { type: String, required: true, enum: Object.values(TransactionStatus),  },
    amount: { type: Number, required: true},
    created_at: {type: Date, default: Date.now},
    description:{ type: String},
    }
  ,{
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

  export {Transaction,TransactionDoc};