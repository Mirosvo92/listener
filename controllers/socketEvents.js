const { events } = require('../events');
const { bnbController } = require('../bnb-controller');

function handleSocketEvents(io) {
  io.on('connection', (socket) => {
    console.log('connected');
    socket.on(events.ListenContractTransactions, (data) => bnbController.listenTransactionsOnContract(data, socket));
    socket.on(events.StopListenContractTransactions, (data) =>
      bnbController.listenTransactionsOnContract(data, socket)
    );
  });
}

module.exports = {
  handleSocketEvents,
};
