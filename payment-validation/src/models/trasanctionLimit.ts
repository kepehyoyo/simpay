import mongoose from "mongoose";

export enum AccountType {
    CUSTOMER = 'CUSTOMER',
    MERCHANT = 'MERCHANT',
  }
  
  export enum VerificationLevel {
    LEVEL_1 = 1,
    LEVEL_2 = 2,
    LEVEL_3 = 3,
  }

  interface TransactionLimitAttrs {
    accountType: AccountType;
    verificationLevel: VerificationLevel;
    dailyLimit: number;
    weeklyLimit: number;
    monthlyLimit: number;
  }
// An interface that describes the properties
// that a TransactionLimit Model has
interface TransactionLimitModel extends mongoose.Model<TransactionLimitDoc> {
    build(attrs: TransactionLimitAttrs): TransactionLimitDoc;
  }
  
  // An interface that describes the properties
  // that a TransactionLimit Document has
  interface TransactionLimitDoc extends mongoose.Document {
    accountType: AccountType;
    verificationLevel: VerificationLevel;
    dailyLimit: number;
    weeklyLimit: number;
    monthlyLimit: number;
  }
  
  const transactionLimitSchema = new mongoose.Schema(
    {
        accountType: { type: String, required: true },
        verificationLevel: { type: Number, required: true },
        dailyLimit: { type: Number, required: true },
        weeklyLimit: { type: Number, required: true },
        monthlyLimit: { type: Number, required: true },
    },
  );
  
  
  transactionLimitSchema.statics.build = (attrs: TransactionLimitAttrs) => {
    return new TransactionLimit(attrs);
  };
  
  const TransactionLimit = mongoose.model<TransactionLimitDoc, TransactionLimitModel>('TransactionLimit', transactionLimitSchema);
  
  export { TransactionLimit,TransactionLimitDoc };
    