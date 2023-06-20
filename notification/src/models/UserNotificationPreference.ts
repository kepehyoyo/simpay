import mongoose from 'mongoose';
 
// An interface that describes the properties
// that are requried to create a new UserNotificationPreference
interface UserNotificationPreferenceAttrs {
    userId: string;
    email: boolean;
    sms: boolean;
    push: boolean;
    frequency: 'daily' | 'weekly';
}

// An interface that describes the properties
// that a UserNotificationPreference Model has
interface UserNotificationPreferenceModel extends mongoose.Model<UserNotificationPreferenceDoc> {
  build(attrs: UserNotificationPreferenceAttrs): UserNotificationPreferenceDoc;
}

// An interface that describes the properties
// that a UserNotificationPreference Document has
interface UserNotificationPreferenceDoc extends mongoose.Document {
    userId: string;
    email: boolean;
    sms: boolean;
    push: boolean;
    frequency: 'daily' | 'weekly';
}

const userNotificationPreferenceSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
    frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
  
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


userNotificationPreferenceSchema.statics.build = (attrs: UserNotificationPreferenceAttrs) => {
  return new UserNotificationPreference(attrs);
};

const UserNotificationPreference = mongoose.model<UserNotificationPreferenceDoc, UserNotificationPreferenceModel>('UserNotificationPreference', userNotificationPreferenceSchema);

export { UserNotificationPreference };
