/**
 * Common TypeScript interfaces and types for the application
 */

// Base component props that most components will extend
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

// API response wrapper type
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Loading states for async operations
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Generic error type
export interface AppError {
  message: string;
  code?: string | number;
  details?: unknown;
}

// User interface (example entity)
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Theme configuration
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}