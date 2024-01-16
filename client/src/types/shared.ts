import { ReactNode } from 'react';

export type PropsWithChildren<T extends Record<string, unknown>> = {
  children: ReactNode;
} & T;
