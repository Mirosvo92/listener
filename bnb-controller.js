const { events } = require('./events');
const ethers = require('ethers');
const { getDefaultProvider, getWebsocketProvider } = require('./services/provider-service');
const { io } = require('./socket');
const { bnbAddress, wbnbAddress } = require('./constants');

function isNewToken(address) {
  return address !== bnbAddress && address !== wbnbAddress;
}

async function checkBalance(address) {
  const walletAddress = address; // Replace with your Ethereum wallet address

  // Connect to an Ethereum node using Infura (you need an API key from Infura)
  const providerBsc = new ethers.providers.getDefaultProvider(
    `https://rpc.ankr.com/bsc/091f623b5879046b49683919326ad032b9c4aa31b20c2e7c6e4b9b355ec83ba4`,
    'mainnet'
  );
  const providerETH = new ethers.providers.getDefaultProvider(
    `https://rpc.ankr.com/eth/091f623b5879046b49683919326ad032b9c4aa31b20c2e7c6e4b9b355ec83ba4`,
    'mainnet'
  );
  console.log(providerBsc);
  console.log(providerETH);
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

async function fnListener(contractAddress, param1, param2, event) {
  try {
    // const balance = await checkBalance(param2);
    io.to(contractAddress).emit('new-contract-trans', { balance: { ETH: '0.4', BSC: '0.6' }, contractAddress });
  } catch (error) {
    console.log('ERROR');
    console.log('ERROR');
    console.log('ERROR');
    console.log(error);
    console.log('ERROR');
    console.log('ERROR');
    console.log('ERROR');
  }
}

class BNBController {
  pairCreatedCount = 0;
  factory = null;
  listeningContracts = {};

  createContract(contractAddress) {
    try {
      const provider = new ethers.providers.WebSocketProvider(
        `https://rpc.ankr.com/ws/bsc/091f623b5879046b49683919326ad032b9c4aa31b20c2e7c6e4b9b355ec83ba4`,
        'mainnet'
      );
      console.log('provider', provider);
      provider.on('debug', (data) => {
        if (data.error) {
          console.log(error);
        }
      });

      const contractABI = ['event Transfer(address indexed from, address indexed to, uint256 value)']; // Replace with your contract's ABI
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      console.log('contract', contract);

      return contract;
    } catch (error) {
      console.log('ERROR');
      console.log('ERROR');
      console.log('ERROR');
      console.log(error);
      console.log('ERROR');
      console.log('ERROR');
      console.log('ERROR');
    }
  }

  listenNewPairs = async (socket) => {
    const addresses = {
      factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    };

    const mnemonic = 'celery awesome medal write coconut loyal bamboo print decade present vacuum kite';
    const provider = getWebsocketProvider('bsc');
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    const account = wallet.connect(provider);

    this.factory = new ethers.Contract(
      addresses.factory,
      ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
      account
    );
    console.log('start listen new pairs');
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

    const tokenAddress = isNewToken(token0) ? token0 : token1;

    io.emit(events.NewPairCreated, { tokenAddress });

    if (this.pairCreatedCount === 20) {
      this.factory.off('PairCreated', this.pairCreatedListener);
    }
  };

  listenTransactionsOnContract = async (contractAddress, socket) => {
    console.log('start listen transactions on contract,', contractAddress);
    //We will use contract address as room id.
    const room = io.sockets.adapter.rooms.get(contractAddress);

    //If room already exists, it means that we already listen transactions by this contract
    if (!room) {
      console.log('This contract wasnt listen yet, create room and start listen contract');
      this.listeningContracts[contractAddress] = { contract: null, eventListener: null };
      this.listeningContracts[contractAddress]['contract'] = this.createContract(contractAddress);
      this.listeningContracts[contractAddress]['eventListener'] = function (param1, param2, event) {
        return fnListener(contractAddress, param1, param2, event);
      };

      this.listeningContracts[contractAddress].contract.on(
        'Transfer',
        this.listeningContracts[contractAddress].eventListener
      );
    }

    socket.join(contractAddress);
    console.log('socket joined');
  };

  stopListenTransactionsOnContract = async (contractAddress) => {
    console.log('stop listen transactions on contract', contractAddress);
    const contract = this.listeningContracts[contractAddress].contract;
    const eventListener = this.listeningContracts[contractAddress].eventListener;
    contract.off('Transfer', eventListener);
  };
}

const bnbController = new BNBController();

module.exports = { bnbController };
