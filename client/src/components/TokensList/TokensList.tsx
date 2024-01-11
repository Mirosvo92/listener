import { FC } from 'react';

type Props = {
  items: Item[];
  listeningTokens: any[];
  startListenToken: (address: string) => void;
};

interface Item {
  tokenAddress: string;
  symbol: string;
  isDisabled: boolean;
}

const TokensList: FC<Props> = ({ items, startListenToken, listeningTokens }) => {
  return (
    <div className="w-1/2 max">
      <h3 className="text-2xl font-bold text-center mb-3">New Tokens List</h3>
      <ul className="border-2 rounded-lg border-lime-700 p-4 h-96 overflow-hidden">
        <div className="overflow-auto max-h-full flex flex-col gap-2">
          {!items.length && <p className="text-center pt-8 text-xl">Here you will see new tokens</p>}

          {items.map((item) => {
            const isListening = listeningTokens.includes(item.tokenAddress);

            return (
              <li
                key={item.tokenAddress}
                className="border border-lime-700 rounded-lg flex items-center p-2 justify-between"
              >
                <p>
                  {item.tokenAddress} - {item.symbol}
                </p>
                <button
                  disabled={isListening}
                  className="inline-flex justify-center py-1 px-2 border border-transparent shadow-sm rounded-md text-white bg-lime-700 focus:outline-none disabled:opacity-50"
                  onClick={() => {
                    startListenToken(item.tokenAddress);
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
