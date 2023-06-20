import mongoose from 'mongoose';
 
// An interface that describes the properties
// that are requried to create a new Avatar
interface AvatarAttrs {
    _id: string;
    AvatarId: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

// An interface that describes the properties
// that a Avatar Model has
interface AvatarModel extends mongoose.Model<AvatarDoc> {
  build(attrs: AvatarAttrs): AvatarDoc;
}

// An interface that describes the properties
// that a Avatar Document has
interface AvatarDoc extends mongoose.Document {
    _id: string;
    AvatarId: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const avatarSchema = new mongoose.Schema(
  {
    AvatarId: { type: mongoose.Types.ObjectId, required: true },
    imageUrl: { type: String, required: true },
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

 

avatarSchema.statics.build = (attrs: AvatarAttrs) => {
  return new Avatar(attrs);
};

const Avatar = mongoose.model<AvatarDoc, AvatarModel>('Avatar', avatarSchema);

export { Avatar };
