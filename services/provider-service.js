const ethers = require('ethers');

function getWebsocketProvider(network) {
  return new ethers.providers.WebSocketProvider(
    `wss://rpc.ankr.com/${network}/ws/091f623b5879046b49683919326ad032b9c4aa31b20c2e7c6e4b9b355ec83ba4`,
    'mainnet'
  );
}

function getDefaultProvider(network) {
  return new ethers.providers.getDefaultProvider(
    `https://rpc.ankr.com/${network}/091f623b5879046b49683919326ad032b9c4aa31b20c2e7c6e4b9b355ec83ba4`,
    'mainnet'
  );
}

module.exports = {
  getDefaultProvider,
  getWebsocketProvider,
};
