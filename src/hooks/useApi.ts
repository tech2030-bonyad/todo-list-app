import { useState, useEffect, useCallback } from 'react';
import { ApiResponse, AppError } from '../types';

/**
 * Custom hook for handling API requests with loading, error, and success states
 */
export function useApi<T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AppError | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction();
      
      if (response.success) {
        setData(response.data);
      } else {
        setError({
          code: 'API_ERROR',
          message: response.message || 'An error occurred',
        });
      }
    } catch (err) {
      setError({
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Network error occurred',
        details: err,
      });
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}