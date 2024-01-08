/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect } from 'react';
import { useSocketContext } from '../../contexts/SocketContexts';

type Props = {
  tokenAddress: string;
  delToken: () => void;
};

const TokenWidget: FC<Props> = ({ tokenAddress, delToken }) => {
  const { transByAddress, stopListenContract } = useSocketContext();
  console.log(transByAddress[tokenAddress]);

  useEffect(() => {
    console.log('start listen transactions', tokenAddress);

    return () => {
      // stopListenContract(tokenAddress);
    };
  }, [tokenAddress]);

  return (
    <div className="border-2 rounded-lg border-purple-900  h-96 overflow-hidden mb-3">
      <div className="border-b-2 border-purple-900 px-4 py-2 flex items-center">
        <p className="flex-1">
          <span className="font-bold">Here sould be token symbol</span> ({tokenAddress})
        </p>
        <button
          onClick={() => stopListenContract(tokenAddress)}
          className="inline-flex justify-center py-1 px-2 border border-transparent shadow-sm rounded-md text-white bg-indigo-600 focus:outline-none mr-2"
        >
          Stop
        </button>
        <button
          className="inline-flex justify-center py-1 px-2 border border-transparent shadow-sm rounded-md text-white bg-red-600 focus:outline-none"
          onClick={delToken}
        >
          Del
        </button>
      </div>
      <div className="flex p-2 font-bold">
        <div className="w-2/3">Buyer Address</div>
        <div className="w-1/6">Balance ETH</div>
        <div className="w-1/6">Balance BNB</div>
      </div>
      <div className="overflow-auto max-h-full flex flex-col">
        {transByAddress[tokenAddress]?.map((item: any, i: number) => {
          return (
            <div className="flex px-2 py-1" key={i}>
              <div className="w-2/3">{item.contractAddress}</div>
              <div className="w-1/6">{item.balance.ETH}</div>
              <div className="w-1/6">{item.balance.BSC}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TokenWidget;
