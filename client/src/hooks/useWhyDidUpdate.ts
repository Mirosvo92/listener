import { usePrevious } from './usePrevious';
/* eslint-disable @typescript-eslint/no-explicit-any */

export function useWhyDidUpdate<T extends Record<string, any>>(props: T) {
  const prevProps = usePrevious(props).current;

  if (!prevProps) {
    console.log('Initial render');
    return;
  }

  const prevKeys = Object.keys(prevProps);
  const currentKeys = Object.keys(props);

  const merged = [...new Set(prevKeys.concat(currentKeys))];
  let hasChanged = false;
  merged.forEach((key) => {
    if (prevProps[key] !== props[key]) {
      console.log('============');
      console.log(`Prop with key: ${key} was changed`);
      console.log(`Prev ${key} value: ${prevProps[key]}`);
      console.log(`Current ${key} value: ${props[key]}`);
      hasChanged = true;
    }
  });

  if (!hasChanged) {
    console.log('props wasnt changed');
  }
}
