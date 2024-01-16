import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/store';

export const selectNetworks = (state: RootState) => state.networks.networks;
export const selectCurrentNetwork = (state: RootState) => state.networks.selectedNetwork;
export const selectAvailablenetworks = (state: RootState) => state.networks.availableNetworks;

export const selectTokens = createSelector([selectNetworks, selectCurrentNetwork], (networks, selectedNetwork) => {
  return Object.values(networks[selectedNetwork].tokens);
});

export const selectListeningTokens = createSelector(
  [selectNetworks, selectCurrentNetwork],
  (networks, selectedNetwork) => {
    return networks[selectedNetwork].listeningTokens;
  }
);

export const selectNetworksArray = createSelector([selectNetworks], (networks) => {
  return Object.values(networks).map((network) => ({
    name: network.name,
    namespace: network.namespace,
  }));
});
