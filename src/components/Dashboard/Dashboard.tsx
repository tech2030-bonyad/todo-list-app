import React, { useState, useMemo } from 'react';
import { DataItem, FilterOptions } from '../../types';
import { useApi } from '../../hooks/useApi';
import { apiService } from '../../services/api';
import { DataCard } from '../DataCard/DataCard';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import './Dashboard.css';

/**
 * Main dashboard component that displays data items with filtering capabilities
 */
export const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);

  // Fetch data items using custom hook
  const { data: dataItems, loading, error, refetch } = useApi<DataItem[]>(
    apiService.fetchDataItems
  );

  // Filter data items based on current filters
  const filteredItems = useMemo(() => {
    if (!dataItems) return [];

    return dataItems.filter(item => {
      if (filters.category && item.category !== filters.category) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.dateRange) {
        const itemDate = new Date(item.timestamp);
        if (itemDate < filters.dateRange.start || itemDate > filters.dateRange.end) {
          return false;
        }
      }
      return true;
    });
  }, [dataItems, filters]);

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    if (!dataItems) return [];
    return Array.from(new Set(dataItems.map(item => item.category)));
  }, [dataItems]);

  // Handle data item updates
  const handleItemUpdate = async (id: string, updates: Partial<DataItem>) => {
    try {
      setUpdateLoading(id);
      await apiService.updateDataItem(id, updates);
      await refetch(); // Refresh data after update
    } catch (error) {
      console.error('Failed to update item:', error);
    } finally {
      setUpdateLoading(null);
    }
  };

  // Calculate summary statistics
  const stats = useMemo(() => {
    if (!dataItems) return { total: 0, complete: 0, partial: 0, missing: 0 };

    return dataItems.reduce(
      (acc, item) => ({
        ...acc,
        total: acc.total + 1,
        [item.status]: acc[item.status] + 1,
      }),
      { total: 0, complete: 0, partial: 0, missing: 0 }
    );
  }, [dataItems]);

  if (loading) {
    return <LoadingSpinner size="large" message="Loading dashboard data..." />;
  }

  if (error) {
    return (
      <div className="dashboard__error">
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <button onClick={refetch} className="dashboard__retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1 className="dashboard__title">Data Dashboard</h1>
        <p className="dashboard__subtitle">
          Monitor your data quality and completeness
        </p>
      </header>

      {/* Summary Statistics */}
      <div className="dashboard__stats">
        <div className="dashboard__stat">
          <span className="dashboard__stat-value">{stats.total}</span>
          <span className="dashboard__stat-label">Total Items</span>
        </div>
        <div className="dashboard__stat dashboard__stat--complete">
          <span className="dashboard__stat-value">{stats.complete}</span>
          <span className="dashboard__stat-label">Complete</span>
        </div>
        <div className="dashboard__stat dashboard__stat--partial">
          <span className="dashboard__stat-value">{stats.partial}</span>
          <span className="dashboard__stat-label">Partial</span>
        </div>
        <div className="dashboard__stat dashboard__stat--missing">
          <span className="dashboard__stat-value">{stats.missing}</span>
          <span className="dashboard__stat-label">Missing</span>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard__filters">
        <div className="dashboard__filter-group">
          <label htmlFor="category-filter" className="dashboard__filter-label">
            Category:
          </label>
          <select
            id="category-filter"
            className="dashboard__filter-select"
            value={filters.category || ''}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              category: e.target.value || undefined
            }))}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="dashboard__filter-group">
          <label htmlFor="status-filter" className="dashboard__filter-label">
            Status:
          </label>
          <select
            id="status-filter"
            className="dashboard__filter-select"
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              status: e.target.value as DataItem['status'] || undefined
            }))}
          >
            <option value="">All Statuses</option>
            <option value="complete">Complete</option>
            <option value="partial">Partial</option>
            <option value="missing">Missing</option>
          </select>
        </div>

        <button
          className="dashboard__clear-filters"
          onClick={() => setFilters({})}
          disabled={Object.keys(filters).length === 0}
        >
          Clear Filters
        </button>
      </div>

      {/* Data Grid */}
      <div className="dashboard__grid">
        {filteredItems.length === 0 ? (
          <div className="dashboard__empty">
            <p>No data items match your current filters.</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="dashboard__grid-item">
              {updateLoading === item.id && (
                <div className="dashboard__update-overlay">
                  <LoadingSpinner size="small" message="Updating..." />
                </div>
              )}
              <DataCard
                item={item}
                onUpdate={handleItemUpdate}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};