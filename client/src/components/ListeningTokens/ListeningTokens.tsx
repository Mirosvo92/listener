import { FC } from 'react';
import { useSockets } from 'src/contexts/SocketsContext';
import { useAppSelector } from 'src/store';
import { selectListeningTokensByNamespace } from 'src/store/slices/networks/selectors';
import TokenWidget from '../TokenWidget/TokenWidget';

type Props = {
  namespace: string;
};
const ListeningTokens: FC<Props> = ({ namespace }) => {
  const { getSocket } = useSockets();

  const socket = getSocket(namespace);

  const listeningTokens = useAppSelector((state) => selectListeningTokensByNamespace(state, namespace));

  const delToken = (address: string) => {
    socket?.emit('stop-listen-contract-transactions', address);
  };
  return (
    <div className="w-1/2 max">
      <h3 className="text-2xl font-bold text-center mb-3">Listening tokens</h3>
      {!listeningTokens.length && <p className="text-center text-xl">You dont listen any token transactions yet</p>}
      {listeningTokens.map((item) => {
        return <TokenWidget key={item} tokenAddress={item} delToken={() => delToken(item)} />;
      })}
    </div>
  );
};

export default ListeningTokens;
