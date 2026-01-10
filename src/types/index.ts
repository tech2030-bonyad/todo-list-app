// Type definitions for the application
export interface DataItem {
  id: string;
  title: string;
  value: number | string;
  category: string;
  timestamp: Date;
  status: 'active' | 'inactive' | 'pending';
  metadata?: Record<string, any>;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface FilterOptions {
  category?: string;
  status?: DataItem['status'];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

export interface AppError {
  code: string;
  message: string;
  details?: any;
}