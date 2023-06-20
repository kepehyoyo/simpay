import mongoose from 'mongoose';
 
// An interface that describes the properties
// that are requried to create a new NotificationLog
interface NotificationLogAttrs {
  userId: string;
  message: string;
  sentDate: Date;
  deliveryStatus: 'success' | 'failure';
}

// An interface that describes the properties
// that a NotificationLog Model has
interface NotificationLogModel extends mongoose.Model<NotificationLogDoc> {
  build(attrs: NotificationLogAttrs): NotificationLogDoc;
}

// An interface that describes the properties
// that a NotificationLog Document has
interface NotificationLogDoc extends mongoose.Document {
  userId: string;
  message: string;
  sentDate: Date;
  deliveryStatus: 'success' | 'failure';
}


const notificationLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, },
    message: { type: String, required: true },
    sentDate: { type: Date, required: true },
    deliveryStatus: { type: String, required: true, enum: ['success', 'failure'] },
  
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

notificationLogSchema.statics.build = (attrs: NotificationLogAttrs) => {
  return new NotificationLog(attrs);
};

const NotificationLog = mongoose.model<NotificationLogDoc, NotificationLogModel>('NotificationLog', notificationLogSchema);

export { NotificationLog };
