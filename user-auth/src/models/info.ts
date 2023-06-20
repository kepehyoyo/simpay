import mongoose from 'mongoose';

interface InfoAttrs {
  userId: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  
}

interface InfoDoc extends mongoose.Document {
userId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;

}

interface InfoModel extends mongoose.Model<InfoDoc> {
  build(attrs: InfoAttrs): InfoDoc;
}

const infoSchema = new mongoose.Schema(
  {
    userId: {
        type: String,
        required: true,
      },
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      default: null,
    },
    lastName: {
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
      },
    },
  }
);

infoSchema.statics.build = (attrs: InfoAttrs) => {
  return new Info(attrs);
};

const Info = mongoose.model<InfoDoc, InfoModel>('Info', infoSchema);

export { Info };
