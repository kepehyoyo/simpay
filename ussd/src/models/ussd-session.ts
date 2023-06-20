import mongoose from 'mongoose'; 
// An interface that describes the properties
// that are requried to create a new USSDSession
interface USSDSessionAttrs {
  phoneNumber: string;
  menu: string;
  selection: string;
  data: Record<string, any>;
}

// An interface that describes the properties
// that a USSDSession Model has
interface USSDSessionModel extends mongoose.Model<USSDSessionDoc> {
  build(attrs: USSDSessionAttrs): USSDSessionDoc;
}

// An interface that describes the properties
// that a USSDSession Document has
interface USSDSessionDoc extends mongoose.Document {
  phoneNumber: string;
  menu: string;
  selection: string;
  data: Record<string, any>;
}

const USSDSessionSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
    },
    menu: {
      type: String,
      required: true,
    },
    selection: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      default: {},
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id; 
        delete ret.__v;
      }
    },
     timestamps: true 
  }
);

 
USSDSessionSchema.statics.build = (attrs: USSDSessionAttrs) => {
  return new USSDSession(attrs);
};

const USSDSession = mongoose.model<USSDSessionDoc, USSDSessionModel>('USSDSession', USSDSessionSchema);

export { USSDSession };
