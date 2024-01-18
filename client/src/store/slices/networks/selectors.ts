import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/store';

export const selectNetworks = (state: RootState) => state.networks.networks;
export const selectCurrentNetwork = (state: RootState) => state.networks.selectedNetwork;
export const selectAvailablenetworks = (state: RootState) => state.networks.availableNetworks;
export const getNamespace = (state: RootState, namespace: string) => namespace;
export const getTokenAddress = (state: RootState, namespace: string, tokenAddress: string) => tokenAddress;

export const selectTokensByNamespace = createSelector([selectNetworks, getNamespace], (networks, namespace) => {
  if (networks[namespace]?.tokens) {
    return Object.values(networks[namespace].tokens);
  }

  return [];
});
export const selectNetworkName = createSelector([selectNetworks, getNamespace], (networks, namespace) => {
  return networks[namespace]?.name;
});

export const selectListeningTokensByNamespace = createSelector(
  [selectNetworks, getNamespace],
  (networks, namespace) => {
    return networks[namespace]?.listeningTokens;
  }
);

export const selectNetworksArray = createSelector([selectNetworks], (networks) => {
  return Object.values(networks).map((network) => ({
    name: network.name,
    namespace: network.namespace,
  }));
});

export const selectTransactions = createSelector(
  [selectNetworks, getNamespace, getTokenAddress],
  (networks, namespace, tokenAddress) => {
    return networks[namespace]?.transactionsByToken[tokenAddress] || [];
  }
);
