/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, FC, useContext, useState } from 'react';
import { useSocket } from '../hooks/useSocket';

const SocketContext = createContext<any | null>(null);

export const SocketProvider: FC<any> = (props) => {
  const [isConnected, setIsConnected] = useState(false);
  const [contracts, setContracts] = useState<any>([]);
  const [transByAddress, setTransByAddress] = useState<any>({});

  const socket = useSocket('http://localhost:3000', {
    ackTimeout: 10000,
    autoConnect: false,
  });

  const startListeners = () => {
    socket.on('new-pair-created', (data: any) => {
      setContracts((prev: any) => [...prev, data]);
    });
    socket.on('connection', (data: any) => {
      console.log('reconected');
    });

    socket.io.on('reconnect', (attempt) => {
      console.log('reconected', attempt);
    });

    socket.on(
      'new-contract-trans',
      (data: { contractAddress: string; balance: { BSC: string; ETH: string }; symbol: string; wallet: string }) => {
        setTransByAddress((prev: any) => {
          if (prev[data.contractAddress]) {
            prev[data.contractAddress].push(data);
          } else {
            prev[data.contractAddress] = [data];
          }

          return { ...prev };
        });
        console.log('new transaction', data);
      }
    );
  };

  const startListenContract = (contractAddress: string) => {
    socket.emit('listen-contract-transactions', contractAddress);
  };

  const stopListenContract = (contractAddress: string) => {
    socket.emit('stop-listen-contract-transactions', contractAddress);
  };

  const connect = () => {
    socket.connect();
    setIsConnected(true);
    startListeners();
  };

  const disconnect = () => {
    socket.close();
    setIsConnected(false);
  };

  return (
    <SocketContext.Provider
      value={{
        contracts,
        transByAddress,
        socket,
        isConnected,
        connect,
        disconnect,
        startListenContract,
        stopListenContract,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const data = useContext(SocketContext);
  if (!data) {
    throw Error('Cannot use "useSocketContext" outside the "SocketProvider"');
  }
  return data;
};
