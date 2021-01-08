const wsAddress = "wss://api.foxbitapi.com.br/WSGateway/";
const WebSocket = require("ws");
const events = require("events");
const eventEmitter = new events.EventEmitter();

export {
  WebSocket,
  wsAddress,
  eventEmitter  
};