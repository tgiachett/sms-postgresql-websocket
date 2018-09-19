const EventEmitter = require('events');

class SocketEventEmitter extends EventEmitter {}

const socketEventEmitter = new SocketEventEmitter();

module.exports = socketEventEmitter;