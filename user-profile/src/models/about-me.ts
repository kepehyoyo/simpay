import mongoose from 'mongoose';
 

// An interface that describes the properties
// that are requried to create a new AboutMe
interface AboutMeAttrs {
    _id: string;
    AboutMeId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

// An interface that describes the properties
// that a AboutMe Model has
interface AboutMeModel extends mongoose.Model<AboutMeDoc> {
  build(attrs: AboutMeAttrs): AboutMeDoc;
}

// An interface that describes the properties
// that a AboutMe Document has
interface AboutMeDoc extends mongoose.Document {
    _id: string;
    AboutMeId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const aboutMeSchema = new mongoose.Schema(
  {
    AboutMeId: { type: mongoose.Types.ObjectId, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id; ;
        delete ret.__v;
      }
    }
  }
);

 

aboutMeSchema.statics.build = (attrs: AboutMeAttrs) => {
  return new AboutMe(attrs);
};

const AboutMe = mongoose.model<AboutMeDoc, AboutMeModel>('AboutMe', aboutMeSchema);

export { AboutMe };
