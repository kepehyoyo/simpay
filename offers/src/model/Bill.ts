 

  import mongoose,{Schema} from 'mongoose'; 
import { BillItem, BillItemDoc } from './BillItem';
  

// An interface that describes the properties
// that are requried to create a new Bill
interface BillAttrs {
    id: string;
    merchantId: string;
    customerId: string;
    date: Date;
    items: BillItemDoc[];
    totalAmount: number;
    totalDiscountAmount: number;
    finalAmount: number;
}

// An interface that describes the properties
// that a Bill Model has
interface BillModel extends mongoose.Model<BillDoc> {
  build(attrs: BillAttrs): BillDoc;
}

// An interface that describes the properties
// that a Bill Document has
interface BillDoc extends mongoose.Document {
    id: string;
    merchantId: string;
    customerId: string;
    date: Date;
    items: BillItemDoc[];
    totalAmount: number;
    totalDiscountAmount: number;
    finalAmount: number;
}

const billSchema = new mongoose.Schema({
        merchantId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Merchant",
        },
        customerId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Customer",
        },
        items: {
          type: [BillItem],
          required: true,
        },
        totalAmount: {
          type: Number,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
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

export { Bill,BillDoc };
