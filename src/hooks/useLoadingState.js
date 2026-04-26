/**
 * useLoadingState Hook
 * Manages loading state with optional timeout
 */

import { useState, useCallback } from 'react';

/**
 * Hook for managing loading state
 * @param {boolean} initialState - Initial loading state
 * @param {number} timeout - Timeout in milliseconds (optional)
 * @returns {object} Loading state and functions
 */
export const useLoadingState = (initialState = false, timeout = null) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState(null);
  let timeoutId = null;

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);

    if (timeout) {
      timeoutId = setTimeout(() => {
        setIsLoading(false);
        setError('Request timeout');
      }, timeout);
    }
  }, [timeout]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }, []);

  const setLoading = useCallback((loading) => {
    setIsLoading(loading);
    if (!loading && timeoutId) {
      clearTimeout(timeoutId);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoading,
    setError,
    clearError,
  };
};

export default useLoadingState;
