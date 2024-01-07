const { events } = require('./events');
const ethers = require('ethers');

function createContract(contractAddress) {
  const provider = new ethers.providers.WebSocketProvider(
    'wss://rpc.ankr.com/bsc/ws/091f623b5879046b49683919326ad032b9c4aa31b20c2e7c6e4b9b355ec83ba4',
    'mainnet'
  );
  const contractABI = ['event Transfer(address indexed from, address indexed to, uint256 value)']; // Replace with your contract's ABI
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  return contract;
}

async function checkBalance(address) {
  const walletAddress = address; // Replace with your Ethereum wallet address

  // Connect to an Ethereum node using Infura (you need an API key from Infura)
  const providerBsc = new ethers.providers.getDefaultProvider(
    'https://rpc.ankr.com/bsc/091f623b5879046b49683919326ad032b9c4aa31b20c2e7c6e4b9b355ec83ba4',
    'mainnet'
  );
  const providerETH = new ethers.providers.getDefaultProvider(
    'https://rpc.ankr.com/eth/091f623b5879046b49683919326ad032b9c4aa31b20c2e7c6e4b9b355ec83ba4',
    'mainnet'
  );
  // Get the balance of the wallet
  const balanceBsc = await providerBsc.getBalance(walletAddress);
  const balanceETH = await providerETH.getBalance(walletAddress);
  console.log(`Wallet balance: ${ethers.utils.formatEther(balanceBsc)} Bsc`);
  console.log(`Wallet balance: ${ethers.utils.formatEther(balanceETH)} ETH`);

  return {
    BSC: ethers.utils.formatEther(balanceBsc),
    ETH: ethers.utils.formatEther(balanceETH),
  };
}

async function fnListener(socket, contract, param1, param2, event) {
  console.log(param1, param2, event);
  const balance = await checkBalance(param2);
  socket.emit('new-contract-trans', { balance, contract });
}

class BNBController {
  pairCreatedCount = 0;
  factory = null;

  listenNewPairs = async (socket) => {
    const addresses = {
      factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    };

    const mnemonic = 'celery awesome medal write coconut loyal bamboo print decade present vacuum kite';
    const provider = new ethers.providers.WebSocketProvider(
      'wss://rpc.ankr.com/bsc/ws/091f623b5879046b49683919326ad032b9c4aa31b20c2e7c6e4b9b355ec83ba4',
      'mainnet'
    );
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    const account = wallet.connect(provider);

    this.factory = new ethers.Contract(
      addresses.factory,
      ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
      account
    );

    this.factory.on('PairCreated', (token0, token1, pairAddress) =>
      this.pairCreatedListener(token0, token1, pairAddress, socket)
    );
  };

  pairCreatedListener = async (token0, token1, pairAddress, socket) => {
    console.log(`
    New pair detected ${new Date()}
    =================
    token0: ${token0}
    token1: ${token1}
    pairAddress: ${pairAddress}
  `);

    socket.emit(events.NewPairCreated, { token0, token1, pairAddress });

    if (this.pairCreatedCount === 20) {
      this.factory.off('PairCreated', this.pairCreatedListener);
    }
  };

  listenTransactionsOnContract = async (contractAddress, socket) => {
    console.log('start listen transactions by contract: ', contractAddress);
    const contract = createContract(contractAddress);
    contract.on('Transfer', (param1, param2, event) => fnListener(socket, contract, param1, param2, event));
  };
}

const bnbController = new BNBController();

module.exports = { bnbController };
