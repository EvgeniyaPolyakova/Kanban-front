import * as Sentry from '@sentry/nextjs';
import { useCallback } from 'react';

const useLogger = () => {
  const error = useCallback((err: unknown) => {
    if (!(err instanceof Error)) return;

    Sentry.captureException(err);
    console.error(err);
  }, []);

  return { error };
};

export default useLogger;
