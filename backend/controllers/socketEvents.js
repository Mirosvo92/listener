const { events } = require('../events');
const { bnbController } = require('../bnb-controller');

function handleSocketEvents(io) {
  const mainNsp = io.of('/');
  const newtworksNsps = {
    bsc: io.of('/bsc'),
    eth: io.of('/eth'),
  };

  io.on('connection', (socket) => {
    console.log('connected');
    socket.on(events.ListenContractTransactions, (data) => bnbController.listenTransactionsOnContract(data, socket));
    socket.on(events.StopListenContractTransactions, (data) =>
      bnbController.stopListenTransactionsOnContract(data, socket)
    );
    socket.on('disconnection', () => {
      console.log('disconected from bsc namespace');
    });
  });

  // newtworksNsps['bsc'].on('connection', (socket) => {
  //   console.log('connected to BSC');
  //
  // });

  // newtworksNsps['eth'].on('connection', (socket) => {
  //   console.log('connected to Ether');
  //   socket.on('disconnection', () => {
  //     console.log('disconected from eth namespace');
  //   });
  // });
}

module.exports = {
  handleSocketEvents,
};
