import { useEffect, useState } from 'react';

export const useResize = (handler: any) => {
  if (!process.browser) return;

  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  function handleResize() {
    setSize([window.innerWidth, window.innerHeight]);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(handler, [size]);
};
