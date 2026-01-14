import React from 'react';
import { DataItem } from '../../types';
import './DataListItem.css';

interface DataListItemProps {
  item: DataItem;
  onClick?: () => void;
}

/**
 * Individual data list item component
 */
export const DataListItem: React.FC<DataListItemProps> = ({
  item,
  onClick,
}) => {
  const getStatusColor = (status: DataItem['status']): string => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'error':
        return 'danger';
      default:
        return 'info';
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div
      className={`data-list-item ${onClick ? 'data-list-item--clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="data-list-item__header">
        <h3 className="data-list-item__title">{item.title}</h3>
        <span className={`data-list-item__status data-list-item__status--${getStatusColor(item.status)}`}>
          {item.status}
        </span>
      </div>

      {item.description && (
        <p className="data-list-item__description">{item.description}</p>
      )}

      <div className="data-list-item__meta">
        <span className="data-list-item__category">{item.category}</span>
        <span className="data-list-item__date">
          Updated: {formatDate(item.updatedAt)}
        </span>
      </div>
    </div>
  );
};