"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const ws = new ws_1.default('ws://localhost:8080');
ws.on('open', () => {
    console.log('WebSocket connection is open');
});
ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    sendMessage("I can now send message my socket");
});
function sendMessage(message) {
    console.log('Sending message:', message);
    if (ws.readyState === ws_1.default.OPEN) {
        ws.send(message);
    }
    else {
        console.error('WebSocket is not open');
    }
}
sendMessage('Hello WebSocket');
/* import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();
 */
