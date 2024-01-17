/* eslint-disable no-extra-boolean-cast */
import { FC, memo } from 'react';
import { useWorkspaceSocket, WorkspaceSocketProvider } from 'src/contexts/SocketContexts';
import { useAppSelector } from 'src/store';
import { selectNetworkName } from 'src/store/slices/networks/selectors';
import ListeningTokens from '../ListeningTokens/ListeningTokens';
import TokensList from '../TokensList/TokensList';
type Props = {
  namespace: string;
};

const NetworkWorkspace: FC<Props> = memo(({ namespace }) => {
  const networkName = useAppSelector((state) => selectNetworkName(state, namespace));
  const { conenctionStatus } = useWorkspaceSocket();
  return (
    <>
      <h3 className="font-bold text-2xl text-center mb-4">
        {networkName} Status: <span className="text-indigo-600">{conenctionStatus}</span>
      </h3>
      <div className="flex gap-4">
        <TokensList namespace={namespace} />
        <ListeningTokens namespace={namespace} />
      </div>
    </>
  );
});

export default NetworkWorkspace;
