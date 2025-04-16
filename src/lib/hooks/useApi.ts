import { useState, useCallback } from 'react';

/**
 * Custom hook for handling API requests with loading, data, and error states
 * @param {Function} apiFunction - The API function to call
 * @returns {Object} - Object containing loading state, error, data, and execute function
 */
export const useApi = (apiFunction: (...args: any[]) => Promise<any>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { loading, error, data, execute };
};