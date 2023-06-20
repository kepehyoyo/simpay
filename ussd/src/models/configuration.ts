import mongoose from 'mongoose'; 

// An interface that describes the properties
// that are requried to create a new Configuration
interface ConfigurationAttrs {
    key: string;
    value: any;
}

// An interface that describes the properties
// that a Configuration Model has
interface ConfigurationModel extends mongoose.Model<ConfigurationDoc> {
  build(attrs: ConfigurationAttrs): ConfigurationDoc;
}

// An interface that describes the properties
// that a Configuration Document has
interface ConfigurationDoc extends mongoose.Document {
    key: string;
  value: any;
}

const configurationSchema = new mongoose.Schema(
  {
    key: {
        type: String,
        required: true,
        unique: true,
      },
      value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
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
 
configurationSchema.statics.build = (attrs: ConfigurationAttrs) => {
  return new Configuration(attrs);
};

const Configuration = mongoose.model<ConfigurationDoc, ConfigurationModel>('Configuration', configurationSchema);

export { Configuration };
