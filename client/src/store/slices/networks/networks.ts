import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Networks } from 'src/types/networks';
import { AddNetworkPayload, AddNewTokenPayload, Network, TokenTransactionsPayload } from './types';

const networksNames = {
  [Networks.BinanceSmartChat]: 'Binance Smart Chain',
  [Networks.Ethereum]: 'Ethereum Network',
  [Networks.AvaxNetwork]: 'Avax Network',
};

const defaultselectedNetwork = Networks.BinanceSmartChat;

const defaultNetwork: Network = {
  name: networksNames['bsc'],
  namespace: 'bsc',
  tokens: {},
  listeningTokens: [],
};

type NetworkTab = {
  name: string;
  namespace: string;
};

export type InitState = {
  selectedNetwork: Networks;
  networks: Record<string, Network>;
  availableNetworks: NetworkTab[];
};

const initialState: InitState = {
  availableNetworks: [
    {
      name: 'Binance Smart Chain',
      namespace: 'bsc',
    },
    {
      name: 'Ethereum Network',
      namespace: 'eth',
    },
    {
      name: 'Avalanche Network',
      namespace: 'avax',
    },
  ],
  selectedNetwork: defaultselectedNetwork,
  networks: {
    [defaultselectedNetwork]: defaultNetwork,
  },
};

const networksSlice = createSlice({
  name: 'networks',
  initialState,
  reducers: {
    selectNetwork: (state, action: PayloadAction<Networks>) => {
      state.selectedNetwork = action.payload;
    },
    addNewToken: (state, action: PayloadAction<AddNewTokenPayload>) => {
      const { network, token } = action.payload;
      const existedNetwork = state.networks[network];

      if (!existedNetwork) {
        state.networks[network] = {
          namespace: network,
          name: networksNames[network as Networks],
          tokens: {
            [token.address]: token,
          },
          listeningTokens: [],
        };
      } else {
        existedNetwork.tokens[token.address] = token;
      }
    },
    listenToken: (state, action: PayloadAction<TokenTransactionsPayload>) => {
      const { address, network } = action.payload;
      let listeningTokens = state.networks[network]?.listeningTokens;

      if (listeningTokens) listeningTokens.push(address);
      else listeningTokens = [address];
    },
    stopListenToken: (state, action: PayloadAction<TokenTransactionsPayload>) => {
      const { address: tokenAddress, network } = action.payload;

      if (state.networks[network]?.listeningTokens) {
        state.networks[network]?.listeningTokens?.filter((address) => address !== tokenAddress);
      }
    },
    addNetwork: (state, action: PayloadAction<AddNetworkPayload>) => {
      const { network } = action.payload;
      const existedNetwork = state.networks[network];

      if (!existedNetwork) {
        state.networks[network] = {
          name: networksNames[network as Networks],
          tokens: {},
          listeningTokens: [],
          namespace: network,
        };
      }
    },
  },
});

export const networkActions = networksSlice.actions;
export const networkReducer = networksSlice.reducer;
