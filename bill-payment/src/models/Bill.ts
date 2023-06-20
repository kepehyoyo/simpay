import mongoose from 'mongoose'; 

// An interface that describes the properties
// that are requried to create a new Bill
interface BillAttrs {
    billId: string;
    amountDue: number;
    dueDate: Date;
    merchant: string;
    invoiceNumber: string;
}

// An interface that describes the properties
// that a Bill Model has
interface BillModel extends mongoose.Model<BillDoc> {
  build(attrs: BillAttrs): BillDoc;
}

// An interface that describes the properties
// that a Bill Document has
interface BillDoc extends mongoose.Document {
    billId: string;
    amountDue: number;
    dueDate: Date;
    merchant: string;
    invoiceNumber: string;
}

const billSchema = new mongoose.Schema(
  {
    billId :{ type: String, required: true },
    amountDue: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    merchant: { type: String, required: true },
    invoiceNumber: { type: String, required: true },
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

 
billSchema.statics.build = (attrs: BillAttrs) => {
  return new Bill(attrs);
};

const Bill = mongoose.model<BillDoc, BillModel>('Bill', billSchema);

export { Bill };
