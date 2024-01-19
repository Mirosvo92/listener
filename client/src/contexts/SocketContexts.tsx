/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  FC,
  memo,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { io, ManagerOptions, SocketOptions } from 'socket.io-client';
import { useLatest } from 'src/hooks/useLatest';
import { usePrevious } from 'src/hooks/usePrevious';
import { useWhyDidUpdate } from 'src/hooks/useWhyDidUpdate';
import { Token, TokenTransaction } from 'src/types/token';
import { useSocket } from '../hooks/useSocket';
import { useAppDispatch } from '../store';
import { networkActions } from '../store/slices/networks/networks';

type SocketStatus = 'init' | 'loading' | 'disconnected' | 'reconnection' | 'error' | 'connected';

const baseUrl = 'http://localhost:3000';

const defaultOptions: Partial<ManagerOptions & SocketOptions> = {
  reconnectionAttempts: 5,
  autoConnect: false,
};
const SocketContext = createContext<any | null>(null);

export const WorkspaceSocketProvider: FC<PropsWithChildren & { namespace: string }> = (props) => {
  const { namespace, children } = props;

  const dispatch = useAppDispatch();

  const [conenctionStatus, setConnectionStatus] = useState<SocketStatus>('init');

  const socket = useSocket(baseUrl + namespace, defaultOptions);

  const startListeners = useCallback(() => {
    socket.on('new-pair-created', (data: Token) => {
      dispatch(networkActions.addNewToken({ network: namespace, token: data }));
      console.log(data);
    });
    socket.on('new-contract-trans', (data: TokenTransaction) => {
      dispatch(networkActions.addNewTransaction({ network: namespace, transaction: data }));
    });

    socket.io.on('reconnect', (attempt) => {
      setConnectionStatus('connected');
      console.log(`reconected with ${attempt} attempt`);
    });
    socket.io.on('reconnect_attempt', (attempt) => {
      setConnectionStatus('reconnection');
      console.log(`try to reconnect: ${attempt} times`);
    });
    // socket.io.on('reconnect_error', (error) => {
    //   setConnectionStatus('error');
    //   console.log(`reconnection error`, error);
    // });
    socket.io.on('reconnect_failed', () => {
      setConnectionStatus('disconnected');
      console.log('failed to reconnect');
    });
    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
      console.log('disconected from', namespace);
    });
  }, []);

  const delToken = useCallback((address: string) => {
    socket?.emit('stop-listen-contract-transactions', address);
  }, []);

  const startListenToken = useCallback((address: string) => {
    socket?.emit('listen-contract-transactions', address);
  }, []);

  useEffect(() => {
    socket.connect();
    console.log('connect', namespace);

    setConnectionStatus('connected');
    startListeners();

    return () => {
      socket.close();
      console.log('disconnect', namespace);
    };
  }, []);

  const value = useMemo(() => {
    return {
      delToken,
      startListenToken,
      conenctionStatus,
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
