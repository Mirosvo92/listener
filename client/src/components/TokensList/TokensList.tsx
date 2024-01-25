import { useAppDispatch, useAppSelector } from 'src/store';
import { FC, useEffect } from 'react';
import { useWorkspaceSocket } from 'src/contexts/SocketContexts';
import { Token } from 'src/types/token';
import { tokensActions } from 'src/store/slices/tokens/slice';
import {
  selectListeningTokensByNetwork,
  selectTokensByNetwork,
  selectTokensIdsByNetwork,
} from 'src/store/slices/tokens/selectors';

type Props = {
  namespace: string;
};

const TokensList: FC<Props> = ({ namespace }) => {
  const { socket } = useWorkspaceSocket();
  const dispatch = useAppDispatch();

  const tokensById = useAppSelector((state) => selectTokensByNetwork(state, namespace));
  const tokensIds = useAppSelector((state) => selectTokensIdsByNetwork(state, namespace));
  const listeningTokens = useAppSelector((state) => selectListeningTokensByNetwork(state, namespace));

  useEffect(() => {
    const newPairListener = (token: Token) => {
      console.log('new toekn');

      dispatch(tokensActions.newToken({ network: namespace, token }));
    };
    console.log('socket', socket);

    socket.on('new-pair-created', newPairListener);
    console.log('start listen pairs');

    return () => {
      socket.off('new-pair-created', newPairListener);
      console.log('stop listen pairs');
    };
  }, []);

  const listenTokenTransactions = (address: string) => {
    dispatch(tokensActions.listenToken({ address, network: namespace }));
  };

  return (
    <div className="w-1/2 max">
      <h3 className="text-2xl font-bold text-center mb-3">New Tokens List</h3>
      <ul className="border-2 rounded-lg border-lime-700 p-4 h-96 overflow-hidden">
        <div className="overflow-auto max-h-full flex flex-col gap-2">
          {!tokensIds.length && <p className="text-center pt-8 text-xl">Here you will see new tokens</p>}

          {tokensIds.map((tokenId) => {
            const token = tokensById[tokenId];
            const isListening = listeningTokens.includes(token.tokenAddress);

            return (
              <li
                key={token.tokenAddress}
                className="border border-lime-700 rounded-lg flex items-center p-2 justify-between"
              >
                <p>
                  {token.tokenAddress} - {token.symbol}
                </p>
                <button
                  disabled={isListening}
                  className="inline-flex justify-center py-1 px-2 border border-transparent shadow-sm rounded-md text-white bg-lime-700 focus:outline-none disabled:opacity-50"
                  onClick={() => {
                    listenTokenTransactions(token.tokenAddress);
                  }}
                >
                  {isListening ? 'Is listening' : 'Listen transactions'}
                </button>
              </li>
            );
          })}
        </div>
      </ul>
    </div>
  );
};

export default TokensList;
