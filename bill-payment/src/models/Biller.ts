import mongoose from 'mongoose';


// An interface that describes the properties
// that are requried to create a new Biller
interface BillerAttrs {
    billerId: string;
    name: string;
    description: string;
    logoUrl: string;
    // ... other fields as needed
}

// An interface that describes the properties
// that a Biller Model has
interface BillerModel extends mongoose.Model<BillerDoc> {
  build(attrs: BillerAttrs): BillerDoc;
}

// An interface that describes the properties
// that a Biller Document has
interface BillerDoc extends mongoose.Document {
    billerId: string;
    name: string;
    description: string;
    logoUrl: string;
}

const billerSchema = new mongoose.Schema(
  {
    billerId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    logoUrl: { type: String, required: true }
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

 

billerSchema.statics.build = (attrs: BillerAttrs) => {
  return new Biller(attrs);
};

const Biller = mongoose.model<BillerDoc, BillerModel>('Biller', billerSchema);

export { Biller };
