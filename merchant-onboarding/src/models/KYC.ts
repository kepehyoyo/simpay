import mongoose from 'mongoose';

// Create and export the model for the

// An interface that describes the properties
// that are requried to create a new KYC
interface KYCAttrs {
    merchantId: string;
  status: string;
  documents: {
    type: string;
    url: string;
  }[];
}

// An interface that describes the properties
// that a KYC Model has
interface KYCModel extends mongoose.Model<KYCDoc> {
  build(attrs: KYCAttrs): KYCDoc;
}

// An interface that describes the properties
// that a KYC Document has
interface KYCDoc extends mongoose.Document {
 merchantId: string;
  status: string;
  documents: {
    type: string;
    url: string;
  }[];
}

const kycSchema = new mongoose.Schema(
  {
    merchantId: { type: String, required: true },
    status: { type: String, required: true },
    documents: [
      {
        type: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
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

 
kycSchema.statics.build = (attrs: KYCAttrs) => {
  return new KYC(attrs);
};

const KYC = mongoose.model<KYCDoc, KYCModel>('KYC', kycSchema);

export { KYC };
