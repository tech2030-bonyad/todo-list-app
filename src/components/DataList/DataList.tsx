import React, { useState, useMemo } from 'react';
import { DataItem, FilterOptions } from '../../types';
import { DataCard } from '../DataCard/DataCard';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import './DataList.css';

interface DataListProps {
  items: DataItem[];
  loading?: boolean;
  error?: string;
  onItemClick?: (item: DataItem) => void;
  onItemEdit?: (item: DataItem) => void;
  onItemDelete?: (item: DataItem) => void;
  onRefresh?: () => void;
}

/**
 * Component for displaying a list of data items with filtering capabilities
 */
export const DataList: React.FC<DataListProps> = ({
  items,
  loading = false,
  error,
  onItemClick,
  onItemEdit,
  onItemDelete,
  onRefresh
}) => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState<'title' | 'timestamp' | 'value'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Get unique categories and statuses for filter options
  const filterOptions = useMemo(() => {
    const categories = [...new Set(items.map(item => item.category))];
    const statuses = [...new Set(items.map(item => item.status))];
    return { categories, statuses };
  }, [items]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(item => {
      if (filters.category && item.category !== filters.category) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          String(item.value).toLowerCase().includes(searchLower)
        );
      }
      return true;
    });

    // Sort items
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'timestamp') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortBy === 'value') {
        aValue = typeof aValue === 'number' ? aValue : 0;
        bValue = typeof bValue === 'number' ? bValue : 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [items, filters, sortBy, sortOrder]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  if (loading) {
    return <LoadingSpinner message="Loading data..." />;
  }

  if (error) {
    return (
      <div className="data-list__error">
        <p className="data-list__error-message">{error}</p>
        {onRefresh && (
          <button className="data-list__retry-button" onClick={onRefresh}>
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="data-list">
      {/* Filters and Controls */}
      <div className="data-list__controls">
        <div className="data-list__filters">
          <input
            type="text"
            placeholder="Search items..."
            value={filters.searchTerm || ''}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="data-list__search"
          />
          
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="data-list__filter-select"
          >
            <option value="">All Categories</option>
            {filterOptions.categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="data-list__filter-select"
          >
            <option value="">All Statuses</option>
            {filterOptions.statuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          
          <button
            onClick={clearFilters}
            className="data-list__clear-filters"
            disabled={Object.keys(filters).length === 0}
          >
            Clear Filters
          </button>
        </div>
        
        <div className="data-list__sort">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="data-list__sort-select"
          >
            <option value="timestamp">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="value">Sort by Value</option>
          </select>
          
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="data-list__sort-order"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="data-list__summary">
        Showing {filteredAndSortedItems.length} of {items.length} items
      </div>

      {/* Items Grid */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="data-list__empty">
          <p>No items found matching your criteria.</p>
        </div>
      ) : (
        <div className="data-list__grid">
          {filteredAndSortedItems.map(item => (
            <DataCard
              key={item.id}
              item={item}
              onClick={onItemClick}
              onEdit={onItemEdit}
              onDelete={onItemDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};