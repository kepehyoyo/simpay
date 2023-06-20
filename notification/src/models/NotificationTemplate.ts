import mongoose from 'mongoose';
 
// An interface that describes the properties
// that are requried to create a new NotificationTemplate
interface NotificationTemplateAttrs {
  templateId: string;
  message: string;
  variables: string[];
}

// An interface that describes the properties
// that a NotificationTemplate Model has
interface NotificationTemplateModel extends mongoose.Model<NotificationTemplateDoc> {
  build(attrs: NotificationTemplateAttrs): NotificationTemplateDoc;
}

// An interface that describes the properties
// that a NotificationTemplate Document has
interface NotificationTemplateDoc extends mongoose.Document {
  templateId: string;
  message: string;
  variables: string[];
}

const notificationTemplateSchema = new mongoose.Schema(
  {
    templateId: { type: String, required: true, unique: true },
    message: { type: String, required: true },
    variables: { type: [String], required: true },
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

 
notificationTemplateSchema.statics.build = (attrs: NotificationTemplateAttrs) => {
  return new NotificationTemplate(attrs);
};

const NotificationTemplate = mongoose.model<NotificationTemplateDoc, NotificationTemplateModel>('NotificationTemplate', notificationTemplateSchema);

export { NotificationTemplate };
