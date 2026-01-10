import { ApiResponse, DataItem, FilterOptions, PaginationOptions } from '../types';

// Mock API base URL - replace with actual API endpoint
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
    // Return mock data for development/demo purposes
    console.warn('API request failed, returning mock data:', error);
    return getMockData<T>(endpoint);
  }
}

/**
 * Mock data generator for development
 */
function getMockData<T>(endpoint: string): ApiResponse<T> {
  const mockItems: DataItem[] = [
    {
      id: '1',
      title: 'Sales Data Q1',
      value: 125000,
      category: 'sales',
      timestamp: new Date('2024-01-15'),
      status: 'active',
      metadata: { region: 'North America' }
    },
    {
      id: '2',
      title: 'User Engagement',
      value: '85%',
      category: 'analytics',
      timestamp: new Date('2024-01-14'),
      status: 'active',
      metadata: { platform: 'web' }
    },
    {
      id: '3',
      title: 'Server Performance',
      value: 99.9,
      category: 'infrastructure',
      timestamp: new Date('2024-01-13'),
      status: 'pending',
      metadata: { server: 'prod-01' }
    }
  ];

  return {
    data: mockItems as T,
    message: 'Mock data retrieved successfully',
    success: true,
    timestamp: new Date().toISOString()
  };
}

/**
 * Fetch data items with optional filtering and pagination
 */
export async function fetchDataItems(
  filters?: FilterOptions,
  pagination?: PaginationOptions
): Promise<ApiResponse<DataItem[]>> {
  const queryParams = new URLSearchParams();
  
  if (filters?.category) queryParams.append('category', filters.category);
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.searchTerm) queryParams.append('search', filters.searchTerm);
  if (pagination?.page) queryParams.append('page', pagination.page.toString());
  if (pagination?.limit) queryParams.append('limit', pagination.limit.toString());

  const endpoint = `/data${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return apiRequest<DataItem[]>(endpoint);
}

/**
 * Fetch a single data item by ID
 */
export async function fetchDataItem(id: string): Promise<ApiResponse<DataItem>> {
  return apiRequest<DataItem>(`/data/${id}`);
}

/**
 * Create a new data item
 */
export async function createDataItem(item: Omit<DataItem, 'id' | 'timestamp'>): Promise<ApiResponse<DataItem>> {
  return apiRequest<DataItem>('/data', {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

/**
 * Update an existing data item
 */
export async function updateDataItem(id: string, item: Partial<DataItem>): Promise<ApiResponse<DataItem>> {
  return apiRequest<DataItem>(`/data/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  });
}

/**
 * Delete a data item
 */
export async function deleteDataItem(id: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/data/${id}`, {
    method: 'DELETE',
  });
}