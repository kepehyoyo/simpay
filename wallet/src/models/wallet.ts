import mongoose from "mongoose";


//An interface that describes the properties that
// are required to create a new Wallet
  interface WalletAttrs {
      userId: string;
      balance?: number;
      currency: string;
      walletId: string;
}

//An interface which describes the properties 
//that a Wallet Model has
interface WalletModel extends mongoose.Model<WalletDoc> {
      build(attrs:WalletAttrs): WalletDoc;
  }
  
//An interface that describes the properties
//that a Wallet Document has
interface WalletDoc extends mongoose.Document{
    walletId:string;
    userId:string;
    balance: number;
    currency:string;
    created_at:Date;
    updated_at:Date;
}

  const walletSchema = new mongoose.Schema ({ 
    walletId: { type: String, required: true ,unique:true},
    userId: { type: String, required: true ,unique:true},
    balance: { type: Number, default: 0 },
    currency: { type: String, required: true },
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
  },{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
  }
  );
 
  walletSchema.statics.build = (attrs:WalletAttrs) =>{
    return new Wallet(attrs)
  }
  
  const Wallet = mongoose.model<WalletDoc,WalletModel>('Wallet',walletSchema);

  export {Wallet,WalletDoc};