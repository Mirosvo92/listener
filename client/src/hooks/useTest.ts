import { useEffect, useMemo, useRef, useState } from 'react';

export const useConnection = (url: string) => {
  const [status, setStatus] = useState<'init' | 'loading' | 'error'>('init');
  const [data, setSData] = useState<any>(null);

  const socket = useRef(new WebSocket(url));

  useEffect(() => {
    socket.current.onmessage((event: { data: any }) => {
      if (event.data) {
        setSData(data);
      }

      if (event.error) {
        setStatus('error');
        setSData(null);
      }
    });

    return () => {
      socket.close();
    };
  }, [socket]);

  return { data, status };
};
