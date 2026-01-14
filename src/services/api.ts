import { ApiResponse, DataItem, PaginatedResponse, FilterOptions } from '../types';

/**
 * API service layer for handling HTTP requests
 */
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.REACT_APP_API_URL || '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic request handler with error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }

  /**
   * Fetch paginated data items with optional filtering
   */
  async getDataItems(
    page: number = 1,
    limit: number = 10,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<DataItem>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    return this.request<DataItem[]>(`/data-items?${params}`);
  }

  /**
   * Fetch a single data item by ID
   */
  async getDataItem(id: string): Promise<ApiResponse<DataItem>> {
    return this.request<DataItem>(`/data-items/${id}`);
  }

  /**
   * Create a new data item
   */
  async createDataItem(item: Omit<DataItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<DataItem>> {
    return this.request<DataItem>('/data-items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  /**
   * Update an existing data item
   */
  async updateDataItem(id: string, item: Partial<DataItem>): Promise<ApiResponse<DataItem>> {
    return this.request<DataItem>(`/data-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  /**
   * Delete a data item
   */
  async deleteDataItem(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/data-items/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();