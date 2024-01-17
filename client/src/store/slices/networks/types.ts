import { Networks } from 'src/types/networks';
import { Token, TokenTransaction } from 'src/types/token';

export type Network = {
  name: string;
  namespace: string;
  tokens: Record<string, Token>;
  listeningTokens: string[];
  transactionsByToken: Record<string, TokenTransaction[]>;
};

export type AddNewTokenPayload = {
  network: string;
  token: Token;
};
export type TokenTransactionsPayload = {
  network: string;
  address: string;
};
export type AddNetworkPayload = {
  network: string;
};
export type DelNetworkPayload = {
  network: string;
};
export type TokenTransactionPayload = {
  network: string;
  transaction: TokenTransaction;
};
