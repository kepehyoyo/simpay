import mongoose from 'mongoose';
 

// An interface that describes the properties
// that are requried to create a new UserProfile
interface UserProfileAttrs {
  
  userId: string;
  firstName: string;
  middleName?:string
  lastName: string;
  phoneNumber: string;
  avatar?: string;
  coverPhoto?: string;
  aboutMe?: string;
  contactInfo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


// An interface that describes the properties
// that a UserProfile Model has
interface UserProfileModel extends mongoose.Model<UserProfileDoc> {
  build(attrs: UserProfileAttrs): UserProfileDoc;
}

// An interface that describes the properties
// that a UserProfile Document has
interface UserProfileDoc extends mongoose.Document {
  
  userId: string;
  firstName: string;
  middleName:string;
  lastName: string;
  phoneNumber:string;
  avatar: string;
  coverPhoto: string;
  aboutMe: string;
  contactInfo: string;
  createdAt: Date;
  updatedAt: Date;

}
    
const userProfileSchema = new mongoose.Schema(
  {
  userId: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String,default: ""},
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  avatar: { type: mongoose.Types.ObjectId, ref: 'Avatar' },
  coverPhoto: { type: mongoose.Types.ObjectId, ref: 'CoverPhoto' },
  aboutMe: { type: mongoose.Types.ObjectId, ref: 'AboutMe' },
  contactInfo: { type: mongoose.Types.ObjectId, ref: 'ContactInfo' },
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

userProfileSchema.statics.build = (attrs: UserProfileAttrs) => {
  return new UserProfile(attrs);
};

const UserProfile = mongoose.model<UserProfileDoc, UserProfileModel>('UserProfile', userProfileSchema);

export { UserProfile ,UserProfileAttrs,UserProfileDoc};
