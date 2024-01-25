/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ManagerOptions, SocketOptions } from 'socket.io-client';
import { useSocket } from '../hooks/useSocket';

type SocketStatus = 'init' | 'loading' | 'disconnected' | 'reconnection' | 'error' | 'connected';

const baseUrl = 'http://localhost:3000/';

const defaultOptions: Partial<ManagerOptions & SocketOptions> = {
  autoConnect: false,
};
const SocketContext = createContext<any | null>(null);

export const WorkspaceSocketProvider: FC<PropsWithChildren & { namespace: string }> = (props) => {
  const { namespace, children } = props;

  const [conenctionStatus, setConnectionStatus] = useState<SocketStatus>('init');
  const socket = useSocket(baseUrl + (namespace === 'bsc' ? '' : namespace), defaultOptions);

  const startListeners = useCallback(() => {
    // Basic listeners for all sockets
    socket.on('connect', () => {
      console.log(`connect`);
      setConnectionStatus('connected');
    });
    socket.io.on('reconnect', (attempt) => {
      setConnectionStatus('connected');
      console.log(`reconected with ${attempt} attempt`);
    });
    socket.io.on('reconnect_attempt', (attempt) => {
      setConnectionStatus('reconnection');
      console.log(`try to reconnect: ${attempt} times`);
    });
    socket.io.on('reconnect_failed', () => {
      setConnectionStatus('disconnected');
      console.log('failed to reconnect');
    });
    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
      console.log('disconected from', namespace);
    });
  }, []);

  useEffect(() => {
    setConnectionStatus('loading');
    socket.connect();

    setConnectionStatus('connected');
    startListeners();

    return () => {
      socket.close();
    };
  }, []);

  const value = useMemo(() => {
    return {
      conenctionStatus,
      socket,
    };
  }, [conenctionStatus]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useWorkspaceSocket = () => {
  const data = useContext(SocketContext);
  if (!data) {
    throw Error('Cannot use "useSocketContext" outside the "WorkspaceSocketProvider"');
  }
  return data;
};
