import React, { useState, useCallback } from 'react';
import { DataItem, FilterOptions } from '../../types';
import { useApi } from '../../hooks/useApi';
import { apiService } from '../../services/api';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { DataListItem } from './DataListItem';
import { DataListFilters } from './DataListFilters';
import { Pagination } from './Pagination';
import './DataList.css';

interface DataListProps {
  onItemSelect?: (item: DataItem) => void;
  className?: string;
}

/**
 * Main data list component with filtering and pagination
 */
export const DataList: React.FC<DataListProps> = ({
  onItemSelect,
  className = '',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({});
  const itemsPerPage = 10;

  // Fetch data with current filters and pagination
  const { data, loading, error, refetch } = useApi(
    () => apiService.getDataItems(currentPage, itemsPerPage, filters),
    [currentPage, filters]
  );

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemClick = useCallback((item: DataItem) => {
    onItemSelect?.(item);
  }, [onItemSelect]);

  if (loading) {
    return <LoadingSpinner message="Loading data..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  if (!data) {
    return <div className="data-list__empty">No data available</div>;
  }

  return (
    <div className={`data-list ${className}`}>
      <div className="data-list__header">
        <h2 className="data-list__title">Data Items</h2>
        <DataListFilters
          filters={filters}
          onFiltersChange={handleFilterChange}
        />
      </div>

      <div className="data-list__content">
        {data.data.length === 0 ? (
          <div className="data-list__empty">
            No items match your current filters
          </div>
        ) : (
          <div className="data-list__items">
            {data.data.map((item) => (
              <DataListItem
                key={item.id}
                item={item}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>
        )}
      </div>

      {data.pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data.pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};