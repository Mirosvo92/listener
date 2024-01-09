import { FC } from 'react';

type Props = {
  items: { tokenAddress: string, symbol: string}[];
  startListenToken: (address: string) => void;
};

const TokensList: FC<Props> = ({ items, startListenToken }) => {
  return (
    <div className="w-1/2 max">
      <h3 className="text-2xl font-bold text-center mb-3">New Tokens List</h3>
      <ul className="border-2 rounded-lg border-purple-900 p-4 h-96 overflow-hidden">
        <div className="overflow-auto max-h-full flex flex-col gap-2">
          {!items.length && <p className="text-center pt-8 text-xl">Here you will see new tokens</p>}

          {items.map((item) => {
            return (
              <li
                key={item.tokenAddress}
                className="border border-purple-900 rounded-lg flex items-center p-2 justify-between"
              >
                <p>{item.tokenAddress} - {item.symbol}</p>
                <button
                  className="inline-flex justify-center py-1 px-2 border border-transparent shadow-sm rounded-md text-white bg-indigo-600 focus:outline-none"
                  onClick={() => startListenToken(item.tokenAddress)}
                >
                  Listen transactions
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
