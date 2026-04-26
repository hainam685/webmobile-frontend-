/**
 * useAsync Hook
 * Handles async operations with loading, error, and success states
 */

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for managing async operations
 * @param {Function} asyncFunction - Async function to execute
 * @param {boolean} immediate - Execute immediately on mount
 * @returns {object} Async state and functions
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle'); // idle, pending, success, error
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  // Prevent state updates on unmounted component
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args) => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction(...args);
      if (mountedRef.current) {
        setData(response);
        setStatus('success');
      }
      return response;
    } catch (err) {
      if (mountedRef.current) {
        setError(err);
        setStatus('error');
      }
      throw err;
    }
  }, [asyncFunction]);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'pending',
    isError: status === 'error',
    isSuccess: status === 'success',
    isIdle: status === 'idle',
  };
};

export default useAsync;
