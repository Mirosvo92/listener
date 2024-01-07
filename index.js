const app = require('express')();
const server = require('http').createServer(app);
const dotenv = require('dotenv-flow');
const { SocketServer } = require('./socket');

dotenv.config({
  cwd: './environments',
  default_node_env: 'development',
});

new SocketServer(server);

server.listen(3000);
