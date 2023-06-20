import mongoose from 'mongoose'; 

// An interface that describes the properties
// that are requried to create a new Bill
interface BillAttrs {
    _id: string;
    biller: string;
    accountNumber: string;
    amount: number;
    dueDate: Date;
}

// An interface that describes the properties
// that a Bill Model has
interface BillModel extends mongoose.Model<BillDoc> {
  build(attrs: BillAttrs): BillDoc;
}

// An interface that describes the properties
// that a Bill Document has
interface BillDoc extends mongoose.Document {
    _id: string;
    biller: string;
    accountNumber: string;
    amount: number;
    dueDate: Date;
}

const billSchema = new mongoose.Schema(
  {
    biller: {
        type: String,
        required: true,
      },
      accountNumber: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      dueDate: {
        type: Date,
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

 
billSchema.statics.build = (attrs: BillAttrs) => {
  return new Bill(attrs);
};

const Bill = mongoose.model<BillDoc, BillModel>('Bill', billSchema);

export { Bill };
