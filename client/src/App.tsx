/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import './App.css';
import ListeningTokens from './components/ListeningTokens/ListeningTokens';
import TokensList from './components/TokensList/TokensList';
import { useSocketContext } from './contexts/SocketContexts';
import { startListenNewPairs, stopListenNewPairs } from './services/api';

const mock = [
  {
    contractAddress: '0x10ED43C718714eb63d5aAq57B78B54704E256024E',
  },
  {
    contractAddress: '0x10ED43C718714eb63d5aAr57B78B54704E256024E',
  },
  {
    contractAddress: '0x10ED43C718t714eb63d5aA57B78B54704E256024E',
  },
  {
    contractAddress: '0x10ED43C718714edb63d5aA57B78B54704E256024E',
  },
  {
    contractAddress: '0x10ED43C718714ebz63d5aA57B78B54704E256024E',
  },
  {
    contractAddress: '0x10ED43C718714eb63d5aAg57B78B54704E256024E',
  },
  {
    contractAddress: '0x10ED43C718714eb632d5aA57B78B54704E256024E',
  },
  {
    contractAddress: '0x10ED43C718714eb63d5aA57Bg78B54704E256024E',
  },
  {
    contractAddress: '0x10ED43C718714eb63d5aAc57B78B54704E256024E',
  },
  {
    contractAddress: '0x10ED43C718714eb63d51aA57B78B54704E256024E',
  },
  {
    contractAddress: '0x10ED43C718714eb63d65aA57B78B54704E256024E',
  },
];

const listening = [
  '0x6d719ed738c526d932002879844dc706cbd684e1',
  '0x6d719ed738c526d932002879844dc706cbd684e1',
  '0x6d719ed738c526d932002879844dc706cbd684e1',
];

function App() {
  const { connect, disconnect, contracts, startListenContract, isConnected } = useSocketContext();

  const [tokens, setTokens] = useState(mock as any);
  const [listeningTokens, setListeningTokens] = useState([] as string[]);

  const connection = async () => {
    connect();
  };

  const disconnection = async () => {};

  const delToken = (address: string) => {
    setListeningTokens((prev) => {
      return prev.filter((adr) => adr !== address);
    });
    console.log('token deleted', address);
  };

  const startListenToken = (address: string) => {
    startListenContract(address);

    setListeningTokens((prev) => [...prev, address]);

    console.log('start listentoken', address);
  };

  return (
    <div className="bg-violet-400 min-h-dvh p-6">
      <h1 className="text-purple-700 text-center text-4xl font-bold pb-4">Real GEM 💩</h1>
      <div className="flex gap-4 justify-center">
        {isConnected ? (
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm rounded-md text-white bg-indigo-600 focus:outline-none uppercase"
            onClick={disconnection}
          >
            disconnect
          </button>
        ) : (
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm rounded-md text-white bg-indigo-600 focus:outline-none uppercase"
            onClick={connection}
          >
            connect
          </button>
        )}
      </div>
      <div className="flex gap-4">
        <TokensList items={contracts} startListenToken={startListenToken} />
        <ListeningTokens items={listeningTokens} delToken={delToken} />
      </div>
    </div>
  );
}

export default App;
