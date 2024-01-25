import { Token } from 'src/types/token';

export type TokensState = {
  byNetworks: {
    [network: string]: {
      byId: {
        [id: string]: Token;
      };
      ids: string[];
      listeningTokens: string[];
    };
  };
};

export type AddNewTokenPayload = {
  network: string;
  token: Token;
};

export type ListenTokenPayload = {
  network: string;
  address: string;
};
