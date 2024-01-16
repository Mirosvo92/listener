export type Token = {
  address: string;
  symbol: string;
};

export type TokenTransaction = {
  wallet: string;
  balance: {
    BSC: string;
    ETH: string;
  };
};
