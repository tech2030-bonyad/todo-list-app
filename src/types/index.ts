/**
 * Common type definitions for the application
 */

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataItem extends BaseEntity {
  title: string;
  description?: string;
  status: DataStatus;
  category: string;
  metadata?: Record<string, any>;
}

export type DataStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  status?: DataStatus;
  category?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface AppError {
  code: string;
  message: string;
  details?: any;
}