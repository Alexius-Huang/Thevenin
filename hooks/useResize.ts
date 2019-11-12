import { useEffect } from 'react';

export const useResize = (handler: any) => {
  useEffect(() => {
    if (!process.browser) return;

    handler();
    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    };
  });
};
