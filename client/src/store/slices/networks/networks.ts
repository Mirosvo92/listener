import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Networks } from 'src/types/networks';
import { AddNetworkPayload, AddNewTokenPayload, DelNetworkPayload, Network, TokenTransactionsPayload } from './types';

const networksNames = {
  [Networks.BinanceSmartChat]: 'Binance Smart Chain',
  [Networks.Ethereum]: 'Ethereum Network',
  [Networks.AvaxNetwork]: 'Avax Network',
};

// const defaultselectedNetwork = Networks.BinanceSmartChat;

// const defaultNetwork: Network = {
//   name: networksNames['bsc'],
//   namespace: 'bsc',
//   tokens: {},
//   listeningTokens: [],
// };

type NetworkTab = {
  name: string;
  namespace: string;
};

export type InitState = {
  selectedNetwork: Networks | '';
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
  selectedNetwork: '',
  networks: {},
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
        state.selectedNetwork = network as Networks;
      }
    },

    deleteNetwork: (state, action: PayloadAction<DelNetworkPayload>) => {
      const { network } = action.payload;
      const existedNetwork = state.networks[network];

      if (!existedNetwork) return state;

      delete state.networks[network];

      const networksLength = Object.keys(state.networks);
      if (!networksLength) state.selectedNetwork = '';
      else {
        const networksKeys = Object.keys(state.networks);
        state.selectedNetwork = networksKeys[networksKeys.length - 1] as Networks;
      }
    },
  },
});

export const networkActions = networksSlice.actions;
export const networkReducer = networksSlice.reducer;
