import { FC } from 'react';
import { useWorkspaceSocket } from 'src/contexts/SocketContexts';

const networkNames: Record<string, string> = {
  bsc: 'Binance Smart Chain',
  eth: 'Ethereum Network',
  avax: 'Avalanche Network',
};

export const WorkspaceStatus: FC<{ namespace: string }> = ({ namespace }) => {
  const { conenctionStatus } = useWorkspaceSocket();
  return (
    <h3 className="font-bold text-2xl text-center mb-4">
      {networkNames[namespace]} | status: <span className="text-indigo-600">{conenctionStatus}</span>
    </h3>
  );
};
