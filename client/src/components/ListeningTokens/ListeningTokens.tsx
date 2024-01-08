import { FC } from 'react';
import TokenWidget from '../TokenWidget/TokenWidget';

type Props = {
  items: string[];
  delToken: (address: string) => void;
};
const ListeningTokens: FC<Props> = ({ items, delToken }) => {
  return (
    <div className="w-1/2 max">
      <h3 className="text-2xl font-bold text-center mb-3">Listening tokens</h3>
      {!items.length && <p className="text-center text-xl">You dont listen any token transactions yet</p>}
      {items.map((item) => {
        return <TokenWidget key={item} tokenAddress={item} delToken={() => delToken(item)} />;
      })}
    </div>
  );
};

export default ListeningTokens;
