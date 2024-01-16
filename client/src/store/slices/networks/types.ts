import { Networks } from 'src/types/networks';
import { Token } from 'src/types/token';

export type Network = {
  name: string;
  namespace: string;
  tokens: Record<string, Token>;
  listeningTokens: string[];
};

export type AddNewTokenPayload = {
  network: string;
  token: {
    address: string;
    symbol: string;
  };
};
export type TokenTransactionsPayload = {
  network: Networks;
  address: string;
};
export type AddNetworkPayload = {
  network: string;
};
