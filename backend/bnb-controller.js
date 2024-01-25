const { events } = require('./events');
const ethers = require('ethers');
const { getWebsocketProvider } = require('./services/provider-service');
const { bnbAddress, wbnbAddress } = require('./constants');

const wait = async (ms = 500) => {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
};

function isNewToken(address) {
  return address !== bnbAddress && address !== wbnbAddress;
}

async function checkBalance(address) {
  const walletAddress = address; // Replace with your Ethereum wallet address

  // Connect to an Ethereum node using Infura (you need an API key from Infura)
  const providerBsc = new ethers.providers.getDefaultProvider(process.env.ankrBSChttp, 'mainnet');
  const providerETH = new ethers.providers.getDefaultProvider(process.env.ankrETHhttp, 'mainnet');

  // Get the balance of the wallet
  const balanceBsc = await providerBsc.getBalance(walletAddress);
  const balanceETH = await providerETH.getBalance(walletAddress);

  return {
    BSC: ethers.utils.formatEther(balanceBsc),
    ETH: ethers.utils.formatEther(balanceETH),
  };
}

async function getContractInfoByAbi(address, ABI) {
  const provider = new ethers.providers.getDefaultProvider(process.env.ankrBSChttp, 'mainnet');
  const contract = new ethers.Contract(address, ABI, provider);

  return contract;
}
async function fnListener(contractAddress, from, to, amount, io) {
  console.log('amount', amount);
  console.log('from', from);
  console.log('to', to);
  const symbol = 'BNB';
  const balance = await checkBalance(to);
  io.to(contractAddress).emit(`new-contract-trans/${contractAddress}`, {
    balance,
    contractAddress,
    symbol,
    wallet: to,
  });
}

class BNBController {
  pairCreatedCount = 0;
  factory = null;
  listeningContracts = {};

  async createContract(contractAddress) {
    const provider = getWebsocketProvider('bsc');
    const contractABI = ['event Transfer(address indexed from, address indexed to, uint256 value)'];
    // Replace with your contract's ABI
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    return contract;
  }

  listenNewPairs = async (io) => {
    const addresses = {
      factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    };

    const mnemonic = process.env.mnemonic;
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
      this.pairCreatedListener(token0, token1, pairAddress, io)
    );
  };

  pairCreatedListener = async (token0, token1, pairAddress, io) => {
    console.log(`
    New pair detected ${new Date()}
    =================
    token0: ${token0}
    token1: ${token1}
    pairAddress: ${pairAddress}
  `);

    const tokenAddress = isNewToken(token0) ? token0 : token1;
    const contractInfo = await getContractInfoByAbi(tokenAddress, ['function symbol() view returns (string)']);
    let symbol = 'unknown';

    try {
      symbol = await contractInfo.symbol();
    } catch (error) {
      console.log('can not get symbol');
    }

    io.emit(events.NewPairCreated, { tokenAddress, symbol });

    if (this.pairCreatedCount === 20) {
      this.factory.off('PairCreated', (token0, token1, pairAddress) =>
        this.pairCreatedListener(token0, token1, pairAddress, io)
      );
    }
  };

  listenTransactionsOnContract = async (contractAddress, socket, io) => {
    console.log('start listen transactions on contract,', contractAddress);
    //We will use contract address as room id.
    const room = io.sockets.adapter.rooms.get(contractAddress);

    //If room already exists, it means that we already listen transactions by this contract
    if (!room) {
      console.log('This contract wasnt listen yet, create room and start listen contract');
      this.listeningContracts[contractAddress] = { contract: null, eventListener: null };
      console.log('contractAddress', contractAddress);
      this.listeningContracts[contractAddress]['contract'] = await this.createContract(contractAddress);
      this.listeningContracts[contractAddress]['eventListener'] = function (from, to, amount) {
        return fnListener(contractAddress, from, to, amount, io);
      };
      this.listeningContracts[contractAddress].contract.on(
        'Transfer',
        this.listeningContracts[contractAddress].eventListener
      );
    } else {
      console.log(this.listeningContracts[contractAddress]);
      console.log('This croom already exist, just connect socket to the room');
    }

    socket.join(contractAddress);
  };

  stopListenTransactionsOnContract = async (contractAddress, socket, io) => {
    socket.leave(contractAddress);
    const room = io.sockets.adapter.rooms.get(contractAddress);
    //If last user leave the room, room was deleted, and then we stop listen this contract
    if (!room) {
      const contract = this.listeningContracts[contractAddress]?.contract;
      const eventListener = this.listeningContracts[contractAddress]?.eventListener;
      contract.off('Transfer', eventListener);
    }
  };
}

const bnbController = new BNBController();

module.exports = { bnbController };
