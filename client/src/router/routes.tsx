import { RouteObject, Navigate } from 'react-router-dom';
import NetworkWorkspace from 'src/components/NetworkWorkspace/NetworkWorkspace';
import { MainLayout } from 'src/layouts';
import { NamespaceGuard } from './NamespaceGuard';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '', element: <Navigate to="/bsc" /> },
      {
        path: ':namespace',
        element: (
          <NamespaceGuard>
            <NetworkWorkspace />
          </NamespaceGuard>
        ),
      },
    ],
  },
];
