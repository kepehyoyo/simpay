import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  userId: string
  phoneNumber:string;
  password: string;

 
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  userId: string
  phoneNumber: string;
  password: string;
  checkPassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
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

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
userSchema.methods.checkPassword = async function(password: string) {
  return await Password.compare(this.password, password);
};
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User ,UserDoc};
