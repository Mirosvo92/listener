import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { useLatest } from 'src/hooks/useLatest';

type Listeners = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [eventName: string]: (...args: any[]) => any;
};

type SocketContext = {
  createConnection: (namespace: string, listeners: Listeners) => void;
  deleteConnection: (namespace: string) => void;
  getSocket: (namespace: string) => Socket | undefined;
};

type Connections = {
  [namespace: string]: {
    socket: Socket;
    // status: SocketStatus;
    listeners: Listeners;
  };
};

const defaultOptions: Partial<ManagerOptions & SocketOptions> = {
  reconnectionAttempts: 5,
};

const baseUrl = 'http://localhost:3000';

const SocketsContext = createContext<null | SocketContext>(null);

export const SocketsContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [connections, setConnections] = useState<null | Connections>(null);
  const latestConnection = useLatest(connections);

  console.log('it is working');

  const createConnection = useCallback(
    (namespace: string, listeners: Listeners, options?: Partial<ManagerOptions & SocketOptions>) => {
      const connections = latestConnection.current;

      const isConnectionExist = connections?.[namespace];

      if (isConnectionExist) return;
      const socket = io(baseUrl + namespace, { ...defaultOptions, ...options });

      for (const event in listeners) {
        socket.on(event, listeners[event]);
      }

      socket.on('reconnect', (attempt) => {
        console.log(`reconected with ${attempt} attempt`);
      });
      socket.on('reconnect_attempt', (attempt) => {
        console.log(`try to reconnect: ${attempt} times`);
      });
      socket.on('reconnect_error', (error) => {
        console.log(`reconnection error`, error);
      });
      socket.on('reconnect_failed', () => {
        console.log('failed to reconnect');
      });
      socket.on('disconnect', () => {
        console.log('disconected from', namespace);
      });

      console.log('socket', socket);

      setConnections((prev) => ({ ...prev, [namespace]: { socket, listeners } }));
    },
    []
  );
  const deleteConnection = useCallback((namespace: string) => {
    setConnections((prev) => {
      const connection = prev?.[namespace];
      if (!connection) return prev;
      const { listeners, socket } = connection;
      for (const event in listeners) {
        socket.off(event, listeners[event]);
      }

      socket.disconnect();

      delete prev[namespace];

      return prev;
    });
  }, []);

  const getSocket = useCallback((namespace: string) => {
    const connections = latestConnection.current;
    return connections?.[namespace].socket;
  }, []);

  const value = useMemo(() => {
    return {
      createConnection,
      deleteConnection,
      getSocket,
    };
  }, []);

  return <SocketsContext.Provider value={value}>{children}</SocketsContext.Provider>;
};

export const useSockets = () => {
  const data = useContext(SocketsContext);
  if (!data) {
    throw Error('Cannot use "useSockets" outside the "SocketsContextProvider"');
  }
  return data;
};
