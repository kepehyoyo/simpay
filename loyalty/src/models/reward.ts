

import mongoose, { Schema, Document } from 'mongoose';

// Define the Reward schema
export interface RewardModel extends Document {
    name: string;
    pointCost: number;
  }
  
  const rewardSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    pointCost: {
      type: Number,
      required: true
    }
  });
  
  const Reward = mongoose.model<RewardModel>('Reward', rewardSchema);
  
  export default {  Reward };