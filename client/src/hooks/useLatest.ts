import { useInsertionEffect, useRef } from 'react';

export function useLatest<T>(value: T) {
  const latestRef = useRef(value);

  useInsertionEffect(() => {
    latestRef.current = value;
  }, [value]);

  return latestRef;
}
