import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddNewTokenPayload, ListenTokenPayload, TokensState } from './types';

export {};

const initialState: TokensState = {
  byNetworks: {},
};

const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    newToken: (state, action: PayloadAction<AddNewTokenPayload>) => {
      const { network, token } = action.payload;
      if (!state.byNetworks[network]) {
        state.byNetworks[network] = {
          byId: {
            [token.tokenAddress]: token,
          },
          ids: [token.tokenAddress],
          listeningTokens: [],
        };
      } else {
        state.byNetworks[network].byId[token.tokenAddress] = token;
        state.byNetworks[network].ids.push(token.tokenAddress);
      }
    },
    listenToken: (state, action: PayloadAction<ListenTokenPayload>) => {
      const { network, address } = action.payload;
      state.byNetworks[network].listeningTokens.push(address);
    },
    stopListenToken: (state, action: PayloadAction<ListenTokenPayload>) => {
      const { network, address } = action.payload;
      console.log(network, address);

      state.byNetworks[network].listeningTokens = state.byNetworks[network].listeningTokens.filter(
        (item) => item !== address
      );
    },
  },
});

export const tokensActions = tokensSlice.actions;
export const tokensReducer = tokensSlice.reducer;
