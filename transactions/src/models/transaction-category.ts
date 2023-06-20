
  import mongoose from 'mongoose'; 


  // An interface that describes the properties
  // that are requried to create a new TransactionCategory
  interface TransactionCategoryAttrs {
     name: string;
    description?: string;
    icon?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // An interface that describes the properties
  // that a TransactionCategory Model has
  interface TransactionCategoryModel extends mongoose.Model<TransactionCategoryDoc> {
    build(attrs: TransactionCategoryAttrs): TransactionCategoryDoc;
  }
  
  // An interface that describes the properties
  // that a TransactionCategory Document has
  interface TransactionCategoryDoc extends mongoose.Document {
    name: string;
    description?: string;
    icon?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  const transactionCategorySchema = new mongoose.Schema(
    {
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
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
  
 
  
  transactionCategorySchema.statics.build = (attrs: TransactionCategoryAttrs) => {
    return new TransactionCategory(attrs);
  };
  
  const TransactionCategory = mongoose.model<TransactionCategoryDoc, TransactionCategoryModel>('TransactionCategory', transactionCategorySchema);
  
  export { TransactionCategory };
  