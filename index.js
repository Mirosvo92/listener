const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: { origin: '*'}});
const dotenv = require('dotenv-flow')

// controllers
const BNBListenerController = require('./controllers/bnb-listener.controller');

dotenv.config({
  cwd: './environments',
  default_node_env: 'development'
});

BNBListenerController.setIo(io);


app.get('/listener/bnb', BNBListenerController.startListenNewPair);
app.get('/stop-listener/bnb', BNBListenerController.startListenNewPair);

// app.listen(3000);
server.listen(3000);

