const ethers = require('ethers');

function getWebsocketProvider(network) {
  return new ethers.providers.WebSocketProvider(
    process.env[`ankr${network.toUpperCase()}webSocket`],
    'mainnet'
  );
}

function getDefaultProvider(network) {
  console.log('test', `ankr${network.toUpperCase()}http`);
  return new ethers.providers.getDefaultProvider(
    `ankr${network.toUpperCase()}http`,
    'mainnet'
  );
}

module.exports = {
  getDefaultProvider,
  getWebsocketProvider,
};
