import { FC, PropsWithChildren } from 'react';
import { Navigate, useParams } from 'react-router-dom';

const availableNamespaces = ['bsc', 'eth', 'avax'];

export const NamespaceGuard: FC<PropsWithChildren> = ({ children }) => {
  const { namespace } = useParams<{ namespace: string }>();

  if (!availableNamespaces.includes(namespace || '')) {
    return <Navigate to="/bsc" />;
  }

  return <>{children}</>;
};
