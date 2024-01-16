/* eslint-disable no-extra-boolean-cast */
import { FC, useEffect, useMemo } from 'react';
import { useSockets } from 'src/contexts/SocketsContext';
import { useAppSelector } from 'src/store';
import { selectNetworkName } from 'src/store/slices/networks/selectors';
import ListeningTokens from '../ListeningTokens/ListeningTokens';
import TokensList from '../TokensList/TokensList';
type Props = {
  namespace: string;
  isActive: boolean;
};

const NetworkWorkspace: FC<Props> = ({ namespace, isActive }) => {
  const { createConnection, deleteConnection, getSocket } = useSockets();

  console.log('rerendered', namespace, isActive);

  const isConnected = useMemo(() => getSocket(namespace), [namespace]);
  const networkName = useAppSelector((state) => selectNetworkName(state, namespace));
  const connect = () => {
    createConnection(namespace, {
      'new-pair-created': (data) => {
        console.log(data);
      },
    });
  };

  const disconnect = () => {
    deleteConnection(namespace);
  };
  useEffect(() => {
    console.log('mounted');

    return () => {
      console.log('unmounted');
    };
  }, []);

  return (
    <div className={`min-w-full mb-8 ${isActive ? '' : 'hidden'}`}>
      <h3 className="font-bold text-2xl text-center mb-4">{networkName}</h3>
      <div className="flex gap-4 justify-center">
        <div className="flex items-center gap-3">
          {Boolean(isConnected) ? (
            <button
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm rounded-md text-white bg-lime-600 focus:outline-none uppercase"
              onClick={disconnect}
            >
              disconnect
            </button>
          ) : (
            <button
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm rounded-md text-white bg-lime-600 focus:outline-none uppercase"
              onClick={connect}
            >
              connect
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        <TokensList namespace={namespace} />
        <ListeningTokens namespace={namespace} />
      </div>
    </div>
  );
};

export default NetworkWorkspace;
