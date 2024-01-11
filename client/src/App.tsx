/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import './App.css';
import ListeningTokens from './components/ListeningTokens/ListeningTokens';
import TokensList from './components/TokensList/TokensList';
import { useSocketContext } from './contexts/SocketContexts';

function App() {
  const { connect, disconnect, contracts, startListenContract, stopListenContract, isConnected } = useSocketContext();

  const [listeningTokens, setListeningTokens] = useState([] as string[]);

  const connection = async () => {
    connect();
  };

  const disconnection = async () => {
    disconnect();
  };

  const delToken = (address: string) => {
    stopListenContract(address);
    setListeningTokens((prev) => {
      return prev.filter((adr) => adr !== address);
    });
  };

  const startListenToken = (address: string) => {
    startListenContract(address);
    setListeningTokens((prev) => [...prev, address]);
  };

  return (
    <div className="bg-neutral-900 text-lime-600 min-h-dvh p-6">
      <h1 className="text-center text-4xl font-bold pb-4">Real GEM 💩</h1>
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
        <TokensList items={contracts} startListenToken={startListenToken} listeningTokens={listeningTokens} />
        <ListeningTokens items={listeningTokens} delToken={delToken} />
      </div>
    </div>
  );
}

export default App;
