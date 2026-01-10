import { useState, useEffect, useCallback } from 'react';
import { LoadingState, AppError } from '../types';

/**
 * Custom hook for handling async operations with loading states
 * Provides consistent error handling and loading state management
 */
interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: AppError) => void;
}

interface UseAsyncReturn<T> {
  data: T | null;
  loading: LoadingState;
  error: AppError | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T> {
  const { immediate = false, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<AppError | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading('loading');
        setError(null);
        
        const result = await asyncFunction(...args);
        
        setData(result);
        setLoading('success');
        onSuccess?.(result);
      } catch (err) {
        const appError: AppError = {
          message: err instanceof Error ? err.message : 'An unknown error occurred',
          details: err,
        };
        
        setError(appError);
        setLoading('error');
        onError?.(appError);
      }
    },
    [asyncFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading('idle');
    setError(null);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, reset };
}