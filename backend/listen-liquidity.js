const { ethers } = require('ethers');
const dotenv = require('dotenv-flow');
const { getDefaultProvider, getWebsocketProvider } = require('./services/provider-service');

dotenv.config({
  cwd: './environments',
  default_node_env: 'development',
});

const addresses = {
  factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
};

factory = null;

const mnemonic = process.env.mnemonic;
const provider = getWebsocketProvider('bsc');
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider);

factory = new ethers.Contract(
  addresses.factory,
  ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
  account
);

factory.on('PairCreated', (token0, token1, pairAddress) =>
  this.pairCreatedListener(token0, token1, pairAddress, socket)
);
