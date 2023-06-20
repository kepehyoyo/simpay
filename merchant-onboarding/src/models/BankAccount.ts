import mongoose from 'mongoose'; 


// An interface that describes the properties
// that are requried to create a new BankAccount
interface BankAccountAttrs {
    merchantId: string;
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    bankCode: string; 
    currency: string;
}

// An interface that describes the properties
// that a BankAccount Model has
interface BankAccountModel extends mongoose.Model<BankAccountDoc> {
  build(attrs: BankAccountAttrs): BankAccountDoc;
}

// An interface that describes the properties
// that a BankAccount Document has
interface BankAccountDoc extends mongoose.Document {
    merchantId: string;
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    bankCode: string; 
    currency: string;
}

const bankAccountSchema = new mongoose.Schema(
  {
    merchantId: { String, required: true },
    accountHolderName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    bankName: { type: String, required: true },
    bankCode: { type: String, required: true },
    currency: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);

 
bankAccountSchema.statics.build = (attrs: BankAccountAttrs) => {
  return new BankAccount(attrs);
};

const BankAccount = mongoose.model<BankAccountDoc, BankAccountModel>('BankAccount', bankAccountSchema);

export { BankAccount };
