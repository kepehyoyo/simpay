import mongoose from 'mongoose'; 

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
    phoneNumber: string;
     message: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
    _id: string;
    name: string;
    phoneNumber: string; 
    walletBalance: number;
}

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
        type: String,
        required: true
  },
  message: {
    type: String,
    required: true,
  }
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
 
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
