const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: { origin: '*'}});
const dotenv = require('dotenv-flow');
const ioConfig = require('./config/io');

// controllers
const BNBListenerController = require('./controllers/bnb-listener.controller');
const BNBContractListenerController = require('./controllers/bnb-contract-listener');

dotenv.config({
  cwd: './environments',
  default_node_env: 'development'
});

ioConfig.setIo(io);


app.get('/listener/bnb', BNBListenerController.startListenNewPair);
app.get('/stop-listener/bnb', BNBListenerController.startListenNewPair);

app.get('/listener/bnb-contract/:contract', BNBContractListenerController.newTransactionsListener);
app.get('/stop-listener/bnb-contract/:contract', BNBContractListenerController.stopListener);

// app.listen(3000);
server.listen(3000);

