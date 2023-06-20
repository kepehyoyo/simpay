import * as WebSocket from 'ws';

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
});
