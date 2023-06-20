import mongoose from 'mongoose'; 

// An interface that describes the properties
// that are requried to create a new OfferCategory
interface OfferCategoryAttrs {
    name: string;
    description: string;
}

// An interface that describes the properties
// that a OfferCategory Model has
interface OfferCategoryModel extends mongoose.Model<OfferCategoryDoc> {
  build(attrs: OfferCategoryAttrs): OfferCategoryDoc;
}

// An interface that describes the properties
// that a OfferCategory Document has
interface OfferCategoryDoc extends mongoose.Document {
    name: string;
    description: string;
}

const offerCategorySchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
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

offerCategorySchema.statics.build = (attrs: OfferCategoryAttrs) => {
  return new OfferCategory(attrs);
};

const OfferCategory = mongoose.model<OfferCategoryDoc, OfferCategoryModel>('OfferCategory', offerCategorySchema);

export { OfferCategory,OfferCategoryDoc };
