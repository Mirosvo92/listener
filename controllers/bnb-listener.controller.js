const SocketController = require('./socket.controller');
const ethers = require('ethers');


let io = null;
let factory = null;


async function fnListener(token0, token1, pairAddress) {
  let counter = 0;
  console.log(`
    New pair detected ${new Date()}
    =================
    token0: ${token0}
    token1: ${token1}
    pairAddress: ${pairAddress}
  `);
  SocketController.sendMessage({token0, token1, pairAddress})
  counter++;

  if (counter === 20) {
    factory.off('PairCreated', fnListener)
  }
}

const startListenNewPair = async (req, res) => {
  console.log('start');
  await SocketController.init(io);
  console.log('added SocketController');

  const addresses = {
    WBNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    ETH: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    optimism: "0x4200000000000000000000000000000000000042",
    factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    router: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    recipient: 'recipient of the profit here'
  }

//First address of this mnemonic must have enough BNB to pay for tx fess
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

const setIo = (_io) => {
  io = _io;
};

module.exports = {
  startListenNewPair,
  setIo,
  stopListenerNewPair
}
