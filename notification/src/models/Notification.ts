import mongoose from 'mongoose';
 
// An interface that describes the properties
// that are requried to create a new Notification
interface NotificationAttrs {
    userId: string;
    message: string;
    createdAt: Date;
    sent: boolean;
}       

// An interface that describes the properties
// that a Notification Model has
interface NotificationModel extends mongoose.Model<NotificationDoc> {
  build(attrs: NotificationAttrs): NotificationDoc;
}

// An interface that describes the properties
// that a Notification Document has
interface NotificationDoc extends mongoose.Document {
    userId: string;
    message: string;
    createdAt: Date;
    sent: boolean;
}

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String,required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, required: true },
    sent: { type: Boolean, required: true, default: false },
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

notificationSchema.statics.build = (attrs: NotificationAttrs) => {
  return new Notification(attrs);
};

const Notification = mongoose.model<NotificationDoc, NotificationModel>('Notification', notificationSchema);

export { Notification };
