import React, { useState, useCallback } from 'react';
import { FilterOptions, DataStatus } from '../../types';
import './DataListFilters.css';

interface DataListFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

/**
 * Filter component for the data list
 */
export const DataListFilters: React.FC<DataListFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions: DataStatus[] = ['pending', 'processing', 'completed', 'error'];
  const categoryOptions = ['General', 'Important', 'Archive', 'Draft'];

  const handleInputChange = useCallback((
    field: keyof FilterOptions,
    value: string | undefined
  ) => {
    const newFilters = {
      ...filters,
      [field]: value || undefined,
    };
    onFiltersChange(newFilters);
  }, [filters, onFiltersChange]);

  const handleDateChange = useCallback((
    field: 'dateFrom' | 'dateTo',
    value: string
  ) => {
    const newFilters = {
      ...filters,
      [field]: value ? new Date(value) : undefined,
    };
    onFiltersChange(newFilters);
  }, [filters, onFiltersChange]);

  const clearFilters = useCallback(() => {
    onFiltersChange({});
  }, [onFiltersChange]);

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <div className="data-list-filters">
      <div className="data-list-filters__header">
        <button
          className="data-list-filters__toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          Filters {hasActiveFilters && <span className="data-list-filters__badge">•</span>}
        </button>
        {hasActiveFilters && (
          <button
            className="data-list-filters__clear"
            onClick={clearFilters}
          >
            Clear
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="data-list-filters__content">
          <div className="data-list-filters__row">
            <div className="data-list-filters__field">
              <label htmlFor="search-input">Search</label>
              <input
                id="search-input"
                type="text"
                placeholder="Search by title or description..."
                value={filters.search || ''}
                onChange={(e) => handleInputChange('search', e.target.value)}
              />
            </div>

            <div className="data-list-filters__field">
              <label htmlFor="status-select">Status</label>
              <select
                id="status-select"
                value={filters.status || ''}
                onChange={(e) => handleInputChange('status', e.target.value as DataStatus)}
              >
                <option value="">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="data-list-filters__row">
            <div className="data-list-filters__field">
              <label htmlFor="category-select">Category</label>
              <select
                id="category-select"
                value={filters.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="">All categories</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="data-list-filters__field">
              <label htmlFor="date-from">Date From</label>
              <input
                id="date-from"
                type="date"
                value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange('dateFrom', e.target.value)}
              />
            </div>

            <div className="data-list-filters__field">
              <label htmlFor="date-to">Date To</label>
              <input
                id="date-to"
                type="date"
                value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange('dateTo', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};