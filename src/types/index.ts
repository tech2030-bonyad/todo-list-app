/**
 * Core type definitions for the application
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'viewer';
  lastActive?: Date;
}

export interface DataItem {
  id: string;
  title: string;
  value: number;
  category: string;
  timestamp: Date;
  status: 'complete' | 'partial' | 'missing';
  metadata?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FilterOptions {
  category?: string;
  status?: DataItem['status'];
  dateRange?: {
    start: Date;
    end: Date;
  };
}