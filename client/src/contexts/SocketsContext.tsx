import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

type Listeners = {
  [eventName: string]: (...args: unknown[]) => unknown;
};

type SocketContext = {
  createConnection: (namespace: string, listeners: Listeners) => void;
  deleteConnection: (namespace: string) => void;
  getSocket: (namespace: string) => void;
};

type Connections = {
  [namespace: string]: {
    socket: Socket;
    listeners: Listeners;
  };
};

const baseUrl = 'http://localhost:3000/';

const SocketsContext = createContext<null | SocketContext>(null);

export const SocketsContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [connections, setConnections] = useState<null | Connections>(null);

  const createConnection = useCallback(
    (namespace: string, listeners: Listeners, options?: Partial<ManagerOptions & SocketOptions>) => {
      const isConnectionExist = connections?.[namespace];

      if (isConnectionExist) return;
      const socket = io(baseUrl + namespace, options);

      for (const event in listeners) {
        socket.on(event, listeners[event]);
      }

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
