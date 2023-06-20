import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new Document
interface DocumentAttrs { merchantId: string;
    type: string;
    name: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
}

// An interface that describes the properties
// that a Document Model has
interface DocumentModel extends mongoose.Model<DocumentDoc> {
  build(attrs: DocumentAttrs): DocumentDoc;
}

// An interface that describes the properties
// that a Document Document has
interface DocumentDoc extends mongoose.Document {
    merchantId: string;
    type: string;
    name: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
}

const documentSchema = new mongoose.Schema(
  {
    merchantId: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
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


documentSchema.statics.build = (attrs: DocumentAttrs) => {
  return new Document(attrs);
};

const Document = mongoose.model<DocumentDoc, DocumentModel>('Document', documentSchema);

export { Document };
