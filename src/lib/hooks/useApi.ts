import { useState, useCallback } from 'react';

/**
 * Custom hook for handling API requests with loading, data, and error states
 * @param apiFunction - The API function to call
 * @returns Object containing loading state, error, data, and execute function
 */
export const useApi = <T, Args extends unknown[]>(
  apiFunction: (...args: Args) => Promise<T>
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (...args: Args): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorInstance = err instanceof Error ? err : new Error(String(err));
      setError(errorInstance);
      throw errorInstance;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { loading, error, data, execute };
};
