import mongoose from "mongoose";

import { app } from "./app";
import { customerLevel01Limit, customerLevel02Limit, merchantLevel01Limit, merchantLevel02Limit } from "./contants/transactionlimits";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDb");
    // Save all transaction limit instances to the database
    await customerLevel01Limit.save();
    await customerLevel02Limit.save();
    await merchantLevel01Limit.save();
    await merchantLevel02Limit.save();
    console.log('Transaction limits saved successfully');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();
