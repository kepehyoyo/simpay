import mongoose from 'mongoose';

 
// An interface that describes the properties
// that are requried to create a new Order
interface OrderAttrs {
    merchantId: string;
    customerId: string;
    status: string;
    items: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
  }
  

// An interface that describes the properties
// that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// An interface that describes the properties
// that a Order Document has
interface OrderDoc extends mongoose.Document {
    merchantId: string;
    customerId: string;
    status: string;
    items: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
  }
  

const orderSchema = new mongoose.Schema(
  {
    merchantId: { type: String, required: true },
    customerId: { type: String, required: true },
    status: { type: String, required: true },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
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


orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
