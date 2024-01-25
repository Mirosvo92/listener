/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css';
import { useRoutes } from 'react-router-dom';
import { routes } from './router/routes';

function App() {
  const content = useRoutes(routes);

  return <div className="bg-neutral-900 text-lime-600 min-h-dvh ">{content}</div>;
}

export default App;
