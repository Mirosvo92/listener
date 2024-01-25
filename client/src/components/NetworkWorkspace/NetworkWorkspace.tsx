/* eslint-disable no-extra-boolean-cast */
import { memo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { WorkspaceSocketProvider } from 'src/contexts/SocketContexts';
import ListeningTokens from '../ListeningTokens/ListeningTokens';
import TokensList from '../TokensList/TokensList';
import { WorkspaceStatus } from '../WorkspaceStatus';

const NetworkWorkspace = memo(() => {
  const { namespace } = useParams<{ namespace: string }>();

  useEffect(() => {
    console.log('mount', namespace);
    return () => {
      console.log('UNMOUNT', namespace);
    };
  }, [namespace]);

  return (
    <WorkspaceSocketProvider namespace={namespace || '/'}>
      <WorkspaceStatus namespace={namespace || ''} />
      <div className="flex gap-4">
        <TokensList namespace={namespace || ''} />
        <ListeningTokens namespace={namespace || ''} />
      </div>
    </WorkspaceSocketProvider>
  );
});

export default NetworkWorkspace;
