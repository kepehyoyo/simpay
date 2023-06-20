import mongoose from 'mongoose';
 
// An interface that describes the properties
// that are requried to create a new ContactInfo
interface ContactInfoAttrs {
  _id: string;
  ContactInfoId: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

// An interface that describes the properties
// that a ContactInfo Model has
interface ContactInfoModel extends mongoose.Model<ContactInfoDoc> {
  build(attrs: ContactInfoAttrs): ContactInfoDoc;
}

// An interface that describes the properties
// that a ContactInfo Document has
interface ContactInfoDoc extends mongoose.Document {
    _id: string;
    ContactInfoId: string;
    email: string;
    phone: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

const contactInfoSchema = new mongoose.Schema(
  {
    ContactInfoId: { type: mongoose.Types.ObjectId, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
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

 

contactInfoSchema.statics.build = (attrs: ContactInfoAttrs) => {
  return new ContactInfo(attrs);
};

const ContactInfo = mongoose.model<ContactInfoDoc, ContactInfoModel>('ContactInfo', contactInfoSchema);

export { ContactInfo };
