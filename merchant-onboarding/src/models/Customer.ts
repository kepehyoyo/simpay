import mongoose from 'mongoose';



// An interface that describes the properties
// that are requried to create a new Customer
interface CustomerAttrs {
    customerId: string;
    CustomerId: string;
    phoneNumbers: string[];
}

// An interface that describes the properties
// that a Customer Model has
interface CustomerModel extends mongoose.Model<CustomerDoc> {
  build(attrs: CustomerAttrs): CustomerDoc;
}

// An interface that describes the properties
// that a Customer Document has
interface CustomerDoc extends mongoose.Document {
    customerId: string;
    CustomerId: string;
    phoneNumbers: string[];
}

const customerSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true },
    CustomerId: { type: String, required: true },
    phoneNumbers: [{ type: String, required: true }],
  
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
 
customerSchema.statics.build = (attrs: CustomerAttrs) => {
  return new Customer(attrs);
};

const Customer = mongoose.model<CustomerDoc, CustomerModel>('Customer', customerSchema);

export { Customer };
