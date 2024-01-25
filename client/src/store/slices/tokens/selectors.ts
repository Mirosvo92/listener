import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/store';

const getTokens = (state: RootState) => state.entities.tokens.byNetworks;
const getNetwork = (state: RootState, network: string) => network;

export const selectTokensByNetwork = createSelector([getTokens, getNetwork], (tokens, network) => {
  return tokens[network]?.byId || {};
});
export const selectTokensIdsByNetwork = createSelector([getTokens, getNetwork], (tokens, network) => {
  return tokens[network]?.ids || [];
});
export const selectListeningTokensByNetwork = createSelector([getTokens, getNetwork], (tokens, network) => {
  return tokens[network]?.listeningTokens || [];
});
