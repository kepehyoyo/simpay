 import mongoose ,{Schema} from 'mongoose'; 
  

// An interface that describes the properties
// that are requried to create a new BillItem
interface BillItemAttrs {
    productId: string;
    category: string;
    price: number;
    quantity: number;
    totalPrice: number;
    discountAmount: number;
    offerId?: string;
}

// An interface that describes the properties
// that a BillItem Model has
interface BillItemModel extends mongoose.Model<BillItemDoc> {
  build(attrs: BillItemAttrs): BillItemDoc;
}

// An interface that describes the properties
// that a BillItem Document has
interface BillItemDoc extends mongoose.Document {
    productId: string;
    category: string;
    price: number;
    quantity: number;
    totalPrice: number;
    discountAmount: number;
    offerId?: string;
}

const billItemSchema = new mongoose.Schema(
  {
// Define the BillItem schema
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    offerId: {
      type: Schema.Types.ObjectId,
      ref: "Offer",
  }
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

 

billItemSchema.statics.build = (attrs: BillItemAttrs) => {
  return new BillItem(attrs);
};

const BillItem = mongoose.model<BillItemDoc, BillItemModel>('BillItem', billItemSchema);

export { BillItem, BillItemDoc};
