import mongoose from 'mongoose';

 
// An interface that describes the properties
// that are requried to create a new Merchant
interface MerchantAttrs {
    name: string;
    email: string;
    phone: string;
    status: string;
}

// An interface that describes the properties
// that a Merchant Model has
interface MerchantModel extends mongoose.Model<MerchantDoc> {
  build(attrs: MerchantAttrs): MerchantDoc;
}

// An interface that describes the properties
// that a Merchant Document has
interface MerchantDoc extends mongoose.Document {
    name: string;
    email: string;
    phone: string;
    status: string;
}

const merchantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, required: true }
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

 
merchantSchema.statics.build = (attrs: MerchantAttrs) => {
  return new Merchant(attrs);
};

const Merchant = mongoose.model<MerchantDoc, MerchantModel>('Merchant', merchantSchema);

export { Merchant };
