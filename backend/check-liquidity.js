const { ethers } = require('ethers');

// Define the PancakeSwap Router contract address and the token address
const pancakeRouterAddress = '0x10ed43c718714eb63d5aa57b78b54704e256024e'; // PancakeSwap Router address
const tokenAddress = '0x021358a02d8863e252494d30e9cd4019a7cad0e0'; // Replace with the actual token address

// Connect to the Binance Smart Chain (BSC) node
const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');

// Connect to the PancakeSwap Router contract
const pancakeRouter = new ethers.Contract(pancakeRouterAddress, ['function getAmountsOut(uint amountIn, address[] memory path) external view returns (uint[] memory)'], provider);

async function checkLiquidity() {
  try {
    // Specify the token and WBNB (Wrapped BNB) as the path
    const path = [tokenAddress, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c']; // WBNB address

    // Get the amount of WBNB that would be received for 1 unit of the token
    const amountsOut = await pancakeRouter.getAmountsOut(ethers.utils.parseUnits('1', 'ether'), path);

    const value2 = ethers.BigNumber.from(99000);
    // Check if the amount of WBNB is greater than 0 (indicating liquidity)
    const hasLiquidity = amountsOut[amountsOut.length - 1].gt(value2);
    console.log('amountsOut[amountsOut.length - 1]', amountsOut[amountsOut.length - 1].toString());

    if (hasLiquidity) {
      console.log('The token has liquidity on PancakeSwap.');
    } else {
      console.log('The token does not have liquidity on PancakeSwap.');
    }
  } catch (error) {
    console.error('Error checking liquidity:', error);
  }
}

// Call the function to check liquidity
checkLiquidity();
