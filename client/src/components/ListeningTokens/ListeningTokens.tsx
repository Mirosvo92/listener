import { FC } from 'react';
import { useAppSelector } from 'src/store';
import { selectListeningTokensByNetwork } from 'src/store/slices/tokens/selectors';
import Detachable from '../Detachable/Detachable';
import TokenWidget from '../TokenWidget/TokenWidget';

type Props = {
  namespace: string;
};
const ListeningTokens: FC<Props> = ({ namespace }) => {
  const listeningTokens = useAppSelector((state) => selectListeningTokensByNetwork(state, namespace));

  return (
    <div className="w-1/2 max">
      <h3 className="text-2xl font-bold text-center mb-3">Listening tokens</h3>
      {!listeningTokens?.length && <p className="text-center text-xl">You dont listen any token transactions yet</p>}
      {listeningTokens?.map((item) => {
        return (
          <Detachable key={item}>
            {(props) => {
              return <TokenWidget namespace={namespace} tokenAddress={item} {...props} />;
            }}
          </Detachable>
        );
      })}
    </div>
  );
};

export default ListeningTokens;
