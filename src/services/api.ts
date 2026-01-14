import { ApiResponse, DataItem, User } from '../types';

/**
 * API service layer with mock data for demonstration
 * In production, replace with actual API endpoints
 */

// Mock data to simulate partial/incomplete data scenarios
const mockDataItems: DataItem[] = [
  {
    id: '1',
    title: 'Revenue Q1',
    value: 125000,
    category: 'finance',
    timestamp: new Date('2024-01-15'),
    status: 'complete',
  },
  {
    id: '2',
    title: 'User Signups',
    value: 0, // Partial data - value missing
    category: 'marketing',
    timestamp: new Date('2024-01-16'),
    status: 'partial',
  },
  {
    id: '3',
    title: 'Server Uptime',
    value: 99.9,
    category: 'technical',
    timestamp: new Date('2024-01-17'),
    status: 'complete',
  },
  {
    id: '4',
    title: 'Customer Satisfaction',
    value: 0,
    category: 'support',
    timestamp: new Date('2024-01-18'),
    status: 'missing',
  },
];

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'admin',
  lastActive: new Date(),
};

/**
 * Simulates network delay for realistic API behavior
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  /**
   * Fetch all data items with optional filtering
   */
  async fetchDataItems(): Promise<ApiResponse<DataItem[]>> {
    await delay(1000); // Simulate network delay
    
    try {
      return {
        data: mockDataItems,
        success: true,
        message: 'Data fetched successfully',
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Failed to fetch data items',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  },

  /**
   * Fetch current user information
   */
  async fetchCurrentUser(): Promise<ApiResponse<User>> {
    await delay(500);
    
    try {
      return {
        data: mockUser,
        success: true,
        message: 'User data fetched successfully',
      };
    } catch (error) {
      return {
        data: mockUser, // Fallback to mock user
        success: false,
        message: 'Failed to fetch user data',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  },

  /**
   * Update a data item
   */
  async updateDataItem(id: string, updates: Partial<DataItem>): Promise<ApiResponse<DataItem>> {
    await delay(800);
    
    try {
      const itemIndex = mockDataItems.findIndex(item => item.id === id);
      if (itemIndex === -1) {
        throw new Error('Data item not found');
      }

      mockDataItems[itemIndex] = { ...mockDataItems[itemIndex], ...updates };
      
      return {
        data: mockDataItems[itemIndex],
        success: true,
        message: 'Data item updated successfully',
      };
    } catch (error) {
      return {
        data: {} as DataItem,
        success: false,
        message: 'Failed to update data item',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  },
};