import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new Invoice
interface InvoiceAttrs {
    invoiceNumber: string;
    merchantId: string;
    customerId: string;
    amount: number;
    status: string;
    paymentId: string;
}

// An interface that describes the properties
// that a Invoice Model has
interface InvoiceModel extends mongoose.Model<InvoiceDoc> {
  build(attrs: InvoiceAttrs): InvoiceDoc;
}

// An interface that describes the properties
// that a Invoice Document has
interface InvoiceDoc extends mongoose.Document {
  email: string;
  password: string;
}

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true },
    merchantId: { type: String, required: true },
    customerId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    paymentId: { type: String },
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

 

invoiceSchema.statics.build = (attrs: InvoiceAttrs) => {
  return new Invoice(attrs);
};

const Invoice = mongoose.model<InvoiceDoc, InvoiceModel>('Invoice', invoiceSchema);

export { Invoice };
