/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, FC, useContext, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useSocket } from '../hooks/useSocket';
import { useAppDispatch, useAppSelector } from '../store';
import { networkActions } from '../store/slices/networks/networks';

const SocketContext = createContext<any | null>(null);

export const SocketProvider: FC<any> = (props) => {
  const [isConnected, setIsConnected] = useState(false);
  const [transByAddress, setTransByAddress] = useState<any>({});

  const dispatch = useAppDispatch();
  const selectednetwork = useAppSelector((state) => state.networks.selectedNetwork);

  const socket = useSocket(`http://localhost:3000/`, {
    autoConnect: false,
  });

  const startListeners = () => {
    socket.on('new-pair-created', (data: any) => {
      console.log('new pair created', data);

      dispatch(
        networkActions.addNewToken({
          network: selectednetwork,
          token: { address: data.tokenAddress, symbol: data.symbol },
        })
      );
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
