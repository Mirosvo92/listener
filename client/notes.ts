// type Networks = 'bsc' | 'eth' | 'avax';
enum Networks {
  Ethereum = 'eth',
  BinanceSmartChat = 'bsc',
  AvaxNetwork = 'avax',
}

type NetworksSlice = {
  selectedNetwork: Networks;
  networks: {
    [key in Networks]?: {
      name: string;
      tokens: {
        [address: string]: {
          address: string;
          symbol: string;
        };
      };
      listeningTokens?: string[];
    };
  };
};

export const networksSlice: NetworksSlice = {
  selectedNetwork: Networks.Ethereum,
  networks: {
    bsc: {
      name: 'Binance Smart Chain',
      tokens: {
        asdfasdfasdfasd: {
          address: 'asdfasdfasdfasd',
          symbol: 'TEST',
        },
      },
    },
  },
};
