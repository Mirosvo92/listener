import { FC } from 'react';
import { useSockets } from 'src/contexts/SocketsContext';
import { useAppSelector } from 'src/store';
import ListeningTokens from '../ListeningTokens/ListeningTokens';
import TokensList from '../TokensList/TokensList';
type Props = {
  namespace: string;
};

const NetworkWorkspace: FC<Props> = ({ namespace }) => {
  const { createConnection } = useSockets();

  // const tokens = useAppSelector()

  const connect = () => {
    createConnection(namespace, {
      'new-pair-created': (data) => {
        console.log(data);
      },
    });
  };

  return (
    <div>
      {/* {' '}
      <div className="flex gap-4 justify-center">
        <div className="flex items-center gap-3">
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm rounded-md text-white bg-lime-600 focus:outline-none uppercase"
            onClick={connect}
          >
            connect
          </button>
        </div>
      </div>
      <div className="flex gap-4">
        <TokensList />
        <ListeningTokens items={listeningTokens} delToken={delToken} />
      </div> */}
    </div>
  );
};

export default NetworkWorkspace;

//  {isConnected ? (
//             <button
//               className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm rounded-md text-white bg-lime-600 focus:outline-none uppercase"
//               onClick={disconnection}
//             >
//               disconnect
//             </button>
//           ) : (
//             <button
//               className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm rounded-md text-white bg-lime-600 focus:outline-none uppercase"
//               onClick={connection}
//             >
//               connect
//             </button>
//           )}
