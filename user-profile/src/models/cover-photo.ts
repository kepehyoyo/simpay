import mongoose from 'mongoose'; 
// An interface that describes the properties
// that are requried to create a new CoverPhoto
interface CoverPhotoAttrs {
    _id: string;
  CoverPhotoId: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
// An interface that describes the properties
// that a CoverPhoto Model has
interface CoverPhotoModel extends mongoose.Model<CoverPhotoDoc> {
  build(attrs: CoverPhotoAttrs): CoverPhotoDoc;
}

// An interface that describes the properties
// that a CoverPhoto Document has
interface CoverPhotoDoc extends mongoose.Document {
    _id: string;
    CoverPhotoId: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const coverPhotoSchema = new mongoose.Schema(
  {
    CoverPhotoId: { type: mongoose.Types.ObjectId, required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);
 
coverPhotoSchema.statics.build = (attrs: CoverPhotoAttrs) => {
  return new CoverPhoto(attrs);
};

const CoverPhoto = mongoose.model<CoverPhotoDoc, CoverPhotoModel>('CoverPhoto', coverPhotoSchema);

export { CoverPhoto };
