const ethers = require('ethers');

async function getSymbol(address = '0x7eE8870aDD86bDFBa39BdD3470c0A7F239D7d326', abi) {
  const provider = new ethers.providers.getDefaultProvider(
    `https://rpc.ankr.com/bsc/091f623b5879046b49683919326ad032b9c4aa31b20c2e7c6e4b9b355ec83ba4`,
    'mainnet'
  );
  const contractABI = ['function symbol() view returns (string)'];

  const contract = new ethers.Contract(address, contractABI, provider);
  console.log('contract.symbol()', await contract.symbol());
  return contract.symbol();
}

getSymbol()
