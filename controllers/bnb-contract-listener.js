const ethers = require('ethers');
const SocketController = require('./socket.controller');
const ioConfig = require('../config/io');

function createContract(contractAddress) {
  const provider = new ethers.providers.WebSocketProvider(process.env.ankr,'mainnet');
  const contractABI = ['event Transfer(address indexed from, address indexed to, uint256 value)']; // Replace with your contract's ABI
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  return contract;
}

async function checkBalance(address) {
  const walletAddress = address; // Replace with your Ethereum wallet address

  // Connect to an Ethereum node using Infura (you need an API key from Infura)
  const providerBsc = new ethers.providers.getDefaultProvider('https://rpc.ankr.com/bsc/091f623b5879046b49683919326ad032b9c4aa31b20c2e7c6e4b9b355ec83ba4','mainnet');
  const providerETH = new ethers.providers.getDefaultProvider('https://rpc.ankr.com/eth/091f623b5879046b49683919326ad032b9c4aa31b20c2e7c6e4b9b355ec83ba4','mainnet');
  // Get the balance of the wallet
  const balanceBsc = await providerBsc.getBalance(walletAddress);
  const balanceETH = await providerETH.getBalance(walletAddress);
  console.log(`Wallet balance: ${ethers.utils.formatEther(balanceBsc)} Bsc`);
  console.log(`Wallet balance: ${ethers.utils.formatEther(balanceETH)} ETH`);

  return {
    BSC: ethers.utils.formatEther(balanceBsc),
    ETH: ethers.utils.formatEther(balanceETH)
  }
}

async function fnListener(contract, param1, param2, event) {
  // console.log('Event emitted: param1', param1);
  // console.log('Event emitted: param2 wallet', param2);
  // console.log('Event emitted: event', event);
  // console.log('contract', contract);
  //
  const balance = await checkBalance(param2);

  SocketController.sendMessage('new-contract-trans', {balance, contract})
}

const newTransactionsListener = async (req, res) => {
  const contract = createContract(req.params.contract);

  await SocketController.init(ioConfig.getIo());

  contract.on('Transfer', fnListener.bind(this, req.params.contract));

  return res.send({
    status: 200,
    success: true,
  });
}

const stopListener = (req, res) => {
  const contract = createContract(req.params.contract);

  contract.off('Transfer', fnListener);

  return res.send({
    status: 200,
    success: true,
  });
}

module.exports = {
  newTransactionsListener,
  stopListener
}
