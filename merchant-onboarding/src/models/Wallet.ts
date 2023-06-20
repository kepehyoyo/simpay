import mongoose from 'mongoose';
 
// An interface that describes the properties
// that are requried to create a new Wallet
interface WalletAttrs {
    merchantId: string;
    balance: number;
    currency:string;
}

// An interface that describes the properties
// that a Wallet Model has
interface WalletModel extends mongoose.Model<WalletDoc> {
  build(attrs: WalletAttrs): WalletDoc;
}

// An interface that describes the properties
// that a Wallet Document has
interface WalletDoc extends mongoose.Document {
    merchantId: string;
    balance: number;
    currency:string;
}

const walletSchema = new mongoose.Schema(
  {
    merchantId: { type: String, required: true },
    balance: { type: Number, required: true },
    currency: {type: String, required: true }
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

 
walletSchema.statics.build = (attrs: WalletAttrs) => {
  return new Wallet(attrs);
};

const Wallet = mongoose.model<WalletDoc, WalletModel>('Wallet', walletSchema);

export { Wallet };
