import React from 'react';
import { DataItem } from '../../types';
import './DataCard.css';

interface DataCardProps {
  item: DataItem;
  onClick?: (item: DataItem) => void;
  onEdit?: (item: DataItem) => void;
  onDelete?: (item: DataItem) => void;
}

/**
 * Reusable card component for displaying data items
 */
export const DataCard: React.FC<DataCardProps> = ({
  item,
  onClick,
  onEdit,
  onDelete
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(item);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Are you sure you want to delete this item?')) {
      onDelete(item);
    }
  };

  const getStatusColor = (status: DataItem['status']) => {
    switch (status) {
      case 'active':
        return '#28a745';
      case 'inactive':
        return '#6c757d';
      case 'pending':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  return (
    <div 
      className={`data-card ${onClick ? 'data-card--clickable' : ''}`}
      onClick={handleCardClick}
    >
      <div className="data-card__header">
        <h3 className="data-card__title">{item.title}</h3>
        <div className="data-card__actions">
          {onEdit && (
            <button
              className="data-card__action-button data-card__action-button--edit"
              onClick={handleEditClick}
              title="Edit item"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              className="data-card__action-button data-card__action-button--delete"
              onClick={handleDeleteClick}
              title="Delete item"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
      
      <div className="data-card__content">
        <div className="data-card__value">
          {typeof item.value === 'number' 
            ? item.value.toLocaleString() 
            : item.value
          }
        </div>
        
        <div className="data-card__meta">
          <span className="data-card__category">{item.category}</span>
          <span 
            className="data-card__status"
            style={{ backgroundColor: getStatusColor(item.status) }}
          >
            {item.status}
          </span>
        </div>
        
        <div className="data-card__timestamp">
          {new Date(item.timestamp).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};