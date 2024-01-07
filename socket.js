const { Server } = require('socket.io');
const { bnbController } = require('./bnb-controller.js');
const { events } = require('./events');

class SocketServer {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
      },
    });
    bnbController.listenNewPairs(this.io);

    this.io.on('connection', this.startListeners);
  }

  startListeners = async (socket) => {
    console.log('conected');
    socket.on(events.StopListenPairs, () => bnbController.stopListenNewPairs(this.io));
    socket.on(events.ListenContractTransactions, (data) => bnbController.listenTransactionsOnContract(data, this.io));
  };
}

module.exports = { SocketServer };
