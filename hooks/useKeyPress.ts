import { useEffect } from 'react';

const keyCodeMapping = new Map<number, string>([
  [27, 'ESC'],
  [82, 'R'],
]);

export function useKeyDown(handler: { [key: string]: any }) {
  if (!process.browser) return;

  const keys = new Set<string>(Object.keys(handler));

  function handleKeyDown(e: KeyboardEvent) {
    const { keyCode } = e;
    const keyCodeStr = keyCodeMapping.get(keyCode) as string;

    if (keys.has(keyCodeStr)) handler[keyCodeStr]();
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
};
