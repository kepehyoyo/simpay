import mongoose, { Schema, Document } from 'mongoose';

// Define the Customer schema
export interface CustomerModel extends Document {
  loyaltyPoints: number;
}

const customerSchema = new Schema({
  loyaltyPoints: {
    type: Number,
    default: 0
  }
});

const Customer = mongoose.model<CustomerModel>('Customer', customerSchema);


export default { Customer };
