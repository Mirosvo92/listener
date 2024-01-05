const SocketController = require('./socket.controller');
const ethers = require('ethers');
const ioConfig = require('../config/io');

let factory = null;

async function fnListener(token0, token1, pairAddress) {
  console.log(`
    New pair detected ${new Date()}
    =================
    token0: ${token0}
    token1: ${token1}
    pairAddress: ${pairAddress}
  `);
  let counter = 0;
  SocketController.sendMessage('new-pair', {token0, token1, pairAddress})

  counter++;

  if (counter === 20) {
    factory.off('PairCreated', fnListener)
  }
}

const startListenNewPair = async (req, res) => {
  await SocketController.init(ioConfig.getIo());

  const addresses = {
    factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'
  }

  const mnemonic = process.env.mnemonic;
  const provider = new ethers.providers.WebSocketProvider(process.env.ankr,'mainnet');
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  const account = wallet.connect(provider);

  factory = new ethers.Contract(
    addresses.factory,
    ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
    account
  );

  factory.on('PairCreated', fnListener)

  return res.send({
    status: 200,
    success: true,
  });
}

const stopListenerNewPair = (req, res) => {
  factory.off('PairCreated', fnListener)

  return res.send({
    status: 200,
    success: true,
  });
}

module.exports = {
  startListenNewPair,
  stopListenerNewPair
}
