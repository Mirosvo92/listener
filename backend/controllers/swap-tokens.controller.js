const ethers = require('ethers');
const { validateParams } = require('../helpers/validators');

const addresses = {
  WBNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  router: '0x10ed43c718714eb63d5aa57b78b54704e256024e',
  myAddress: '0x1e3477C5771B82e0AFeC734c2D9a4583573591bb',
}

async function swapBnb(buyToken = '0x2243267f01efc579871eca055027e5214bbe5f14', amount = '1') {
  const mnemonic = process.env.mnemonicBuyWallet;
  const provider = new ethers.providers.WebSocketProvider(process.env.ankrBSCwebSocket);
  const wallet = new ethers.Wallet.fromMnemonic(mnemonic);
  const account = wallet.connect(provider);

// Set up the PancakeSwap router contract
  const pancakeSwapRouter = new ethers.Contract(addresses.router, ['function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory)'], account);

  try {
    // Define the path for the swap (BNB to Token)
    const path = [addresses.WBNB, buyToken];

    // Perform the token swap
    const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutes from now
    const value = ethers.utils.parseUnits(amount, 'ether');
    const gasLimit = 250000;
    const swapTx = await pancakeSwapRouter.swapExactETHForTokens(
      ethers.utils.parseUnits('1', 'ether'), // need to set less and check
      path, // Input and output tokens
      addresses.myAddress, // Recipient address
      deadline,
      { value, gasLimit } //
    );

    const tx = await swapTx.wait();

    return tx;

  } catch (error) {
    console.log('error', error.code);
    return error.code || 'unknown error'
  }
}

async function buyBnbToken(req, res) {
  const token = req.body.token;
  const amount = req.body.amount;
  const validator = validateParams({token, amount});

  if (!validator.valid) {
    return res.json({
      success: false,
      message: validator.text
    });
  }

  const swapTx = await swapBnb(req.body.token, req.body.amount);

  if (swapTx.status === 1) {
    return res.json({
      success: true,
      transactionHash : swapTx.transactionHash
    });
  }

  res.json({
    success: false,
    message: swapTx
  });
}


module.exports = {
  buyBnbToken
};

