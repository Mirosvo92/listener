/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import './App.css';
import ListeningTokens from './components/ListeningTokens/ListeningTokens';
import NetworkWorkspace from './components/NetworkWorkspace/NetworkWorkspace';
import TokensList from './components/TokensList/TokensList';
import { useSocketContext } from './contexts/SocketContexts';
import { useAppDispatch, useAppSelector } from './store';
import { networkActions } from './store/slices/networks/networks';
import { selectAvailablenetworks, selectCurrentNetwork, selectNetworksArray } from './store/slices/networks/selectors';
import { Networks } from './types/networks';

function App() {
  const { connect, disconnect, stopListenContract, isConnected } = useSocketContext();

  const dispatch = useAppDispatch();

  const selectedNetwork = useAppSelector(selectCurrentNetwork);
  const availablenetworks = useAppSelector(selectAvailablenetworks);
  const activeNetworks = useAppSelector(selectNetworksArray);

  const [networkToAdd, setNetworkToAdd] = useState('bsc');

  const setSelectedNetwork = (namespace: string) => {
    dispatch(networkActions.selectNetwork(namespace as Networks));
  };

  const addNewNetwork = () => {
    dispatch(networkActions.addNetwork({ network: networkToAdd }));
  };

  return (
    <div className="bg-neutral-900 text-lime-600 min-h-dvh p-6">
      <h1 className="text-center text-4xl font-bold pb-4">Real GEM 💩</h1>
      <div className="p-6 flex justify-center items-center gap-4">
        <select
          value={networkToAdd}
          onChange={(e) => setNetworkToAdd(e.target.value)}
          className="h-10 w-56 bg-neutral-900 text-lime-600 outline-none border border-lime-600 rounded-lg p-1"
        >
          {availablenetworks.map((network) => (
            <option
              key={network.namespace}
              value={network.namespace}
              defaultChecked={network.namespace === 'bsc' ? true : false}
            >
              {network.name}
            </option>
          ))}
        </select>
        <button
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm rounded-md text-white bg-lime-600 focus:outline-none uppercase"
          onClick={addNewNetwork}
        >
          +Add
        </button>
      </div>
      <div className="border-b-2 border-lime-600 mb-4">
        {activeNetworks.map((tab) => {
          const isActive = tab.namespace === selectedNetwork;
          return (
            <div
              key={tab.namespace}
              onClick={() => setSelectedNetwork(tab.namespace)}
              className={`cursor-pointer inline-flex justify-center py-2 px-4 border border-lime-600 shadow-sm rounded-t-md text-lime-600 focus:outline-none uppercase hover:bg-lime-600 hover:text-white ${
                isActive ? 'bg-lime-600 text-white' : ''
              }`}
            >
              {tab.name}
            </div>
          );
        })}
      </div>
      <NetworkWorkspace />
    </div>
  );
}

export default App;
