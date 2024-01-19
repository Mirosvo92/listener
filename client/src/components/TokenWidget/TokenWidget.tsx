/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect } from 'react';
import { useWorkspaceSocket } from 'src/contexts/SocketContexts';
import { useAppDispatch, useAppSelector } from 'src/store';
import { networkActions } from 'src/store/slices/networks/networks';
import { selectTransactions } from 'src/store/slices/networks/selectors';

type Props = {
  tokenAddress: string;
  namespace: string;
  openWindow: () => void;
  closeWindow: () => void;
  isDetached: boolean;
};

const TokenWidget: FC<Props> = ({ namespace, tokenAddress, openWindow, closeWindow, isDetached }) => {
  const transByAddress = useAppSelector((state) => selectTransactions(state, namespace, tokenAddress));
  const dispatch = useAppDispatch();

  const { startListenToken, delToken } = useWorkspaceSocket();
  useEffect(() => {
    startListenToken(tokenAddress);
    console.log('start listen transactions', tokenAddress);

    return () => {
      delToken(tokenAddress);
    };
  }, [tokenAddress]);

  const handleDelete = () => {
    closeWindow();
    dispatch(networkActions.stopListenTokenAndDelete({ network: namespace, address: tokenAddress }));
  };

  return (
    <div className="border-2 rounded-lg border-lime-700  h-96 overflow-hidden mb-3">
      <div className="border-b-2 border-lime-700 px-4 py-2 flex items-center h-1/6">
        <a href={`https://poocoin.app/tokens/${tokenAddress}`} target="_blank" className="flex-1">
          <span className="font-bold">Here sould be token symbol</span> ({tokenAddress})
        </a>
        {isDetached ? (
          <button
            className="inline-flex justify-center py-1 px-2 border border-transparent shadow-sm rounded-md text-white bg-indigo-600 focus:outline-none"
            onClick={closeWindow}
          >
            close
          </button>
        ) : (
          <button
            className="inline-flex justify-center py-1 px-2 border border-transparent shadow-sm rounded-md text-white bg-indigo-600 focus:outline-none"
            onClick={openWindow}
          >
            Open
          </button>
        )}
        <button
          className="inline-flex justify-center py-1 px-2 border border-transparent shadow-sm rounded-md text-white bg-red-600 focus:outline-none"
          onClick={handleDelete}
        >
          Del
        </button>
      </div>
      <div className="h-5/6">
        <div className="flex p-2 font-bold">
          <div className="w-2/3">Buyer Address</div>
          <div className="w-1/6">Balance ETH</div>
          <div className="w-1/6">Balance BNB</div>
        </div>
        <div className="overflow-auto max-h-full flex flex-col">
          {transByAddress.map((item: any, i: number) => {
            return (
              <div className="flex px-2 py-1" key={i}>
                <div className="w-2/3">
                  <a href={`https://debank.com/profile/${item.wallet}`} target="_blank">
                    {' '}
                    {item.wallet}
                  </a>
                </div>
                <div className="w-1/6">{item.balance.ETH}</div>
                <div className="w-1/6">{item.balance.BSC}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TokenWidget;
