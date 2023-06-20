import WebSocket from 'ws';

// Create a dictionary to keep track of connected clients
const connectedClients: Map<string, WebSocket> = new Map();

// Create a WebSocket server that listens on a specific port
const server = new WebSocket.Server({ port: 8080 });

// Listen for incoming WebSocket connections
server.on('connection', (socket: WebSocket) => {
  // Authenticate the client and get its user ID
  const userId = authenticateClient(socket);

  // Add the connected client to the dictionary
  connectedClients.set(userId, socket);

  // Listen for incoming messages from the client
  socket.on('message', (message: string) => {
    // Process the incoming message and send a response back to the client
    const response = processMessage(message);
    socket.send(response);

    // Update the Simpay database or API with the results of the message processing
    updateSimpayDatabase(response);

    // Broadcast the updated data to all connected clients
    broadcastUpdate(response);
  });

  // Handle disconnections by removing the disconnected client from the dictionary
  socket.on('close', () => {
    connectedClients.delete(userId);
  });
});

function authenticateClient(socket: WebSocket): string {
  // Authenticate the client and return its user ID
}

function processMessage(message: string, senderId: string): void {
  // Process the incoming message and update the Simpay database or API
  const updatedData = updateSimpayDatabase(message);

  // Get the WebSocket connection of the recipient client
  const recipientId = getRecipientId(message);
  const recipientSocket = connectedClients.get(recipientId);

  if (recipientSocket) {
    // Send the updated data to the recipient client
    recipientSocket.send(updatedData);
  }

  // Send an acknowledgement message to the sender client
  const ackMessage = `Message sent to ${recipientId}`;
  const senderSocket = connectedClients.get(senderId);
  if (senderSocket) {
    senderSocket.send(ackMessage);
  }
}


function updateSimpayDatabase(response: string): void {
  // Update the Simpay database or API with the results of the message processing
}

function broadcastUpdate(response: string): void {
  // Broadcast the updated data to all connected clients
  for (const socket of connectedClients.values()) {
    socket.send(response);
  }
}



/* import * as WebSocket from 'ws';

// create a new WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// listen for connection event
wss.on('connection', (ws: WebSocket) => {
  console.log('client connected');

  // send a welcome message to the client
  ws.send('Welcome to the WebSocket server!');

  // listen for message event
  ws.on('message', (message: string) => {
    console.log(`Received message: ${message}`);

    // send the received message back to the client
    ws.send(`You said: ${message}`);
  });

  // listen for close event
  ws.on('close', () => {
    console.log('client disconnected');
  });
}); */


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

