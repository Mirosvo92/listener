const { Server } = require('socket.io');

const app = require('express')();
const server = require('http').createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

module.exports = {
  io,
  server,
  app,
};
