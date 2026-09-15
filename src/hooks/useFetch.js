import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for asynchronous data fetching
 * @param {Function} fetchFunction - Async function returning a promise
 * @param {Array} dependencies - Dependency array to trigger refetch
 * @param {boolean} immediate - Whether to fetch immediately on mount
 */
export const useFetch = (fetchFunction, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errMessage = err?.message || 'Failed to load data';
      setError(errMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  return { data, loading, error, refetch: execute, setData };
};

export default useFetch;
