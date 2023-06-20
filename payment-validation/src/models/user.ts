import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  phoneNumber:string;
  password: string;
  isVerified:boolean;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  phoneNumber: string;
  userId: string;

  isVerified:boolean;
}

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    isVerified: {
      type: Boolean,
      required: true,
      default : true,
    }
  } 
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User,UserDoc };
