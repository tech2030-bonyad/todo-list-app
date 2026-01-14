import { useState, useEffect, useCallback } from 'react';
import { ApiResponse, LoadingState } from '../types';

/**
 * Custom hook for API calls with loading states and error handling
 */
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading({ isLoading: true, error: null });
      const response = await apiCall();
      
      if (response.success) {
        setData(response.data);
        setLoading({ isLoading: false, error: null });
      } else {
        throw new Error(response.message || 'API call failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setLoading({ isLoading: false, error: errorMessage });
      console.error('API Error:', error);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading: loading.isLoading,
    error: loading.error,
    refetch: fetchData,
  };
}