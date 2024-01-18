export type Token = {
  tokenAddress: string;
  symbol: string;
};

export type TokenTransaction = {
  contractAddress: string;
  symbol: string;
  wallet: string;
  balance: {
    BSC: string;
    ETH: string;
  };
};
