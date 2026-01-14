import React from 'react';
import { DataItem } from '../../types';
import './DataCard.css';

interface DataCardProps {
  item: DataItem;
  onUpdate?: (id: string, updates: Partial<DataItem>) => void;
}

/**
 * Card component to display individual data items with status indicators
 */
export const DataCard: React.FC<DataCardProps> = ({ item, onUpdate }) => {
  const getStatusColor = (status: DataItem['status']): string => {
    switch (status) {
      case 'complete':
        return '#28a745';
      case 'partial':
        return '#ffc107';
      case 'missing':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const formatValue = (value: number, status: DataItem['status']): string => {
    if (status === 'missing') return 'No data available';
    if (status === 'partial' && value === 0) return 'Incomplete data';
    
    // Format numbers with appropriate units
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const handleStatusToggle = () => {
    if (!onUpdate) return;
    
    const statusOrder: DataItem['status'][] = ['missing', 'partial', 'complete'];
    const currentIndex = statusOrder.indexOf(item.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    
    onUpdate(item.id, { status: nextStatus });
  };

  return (
    <div className={`data-card data-card--${item.status}`}>
      <div className="data-card__header">
        <h3 className="data-card__title">{item.title}</h3>
        <button
          className="data-card__status-badge"
          style={{ backgroundColor: getStatusColor(item.status) }}
          onClick={handleStatusToggle}
          title={`Click to change status (currently: ${item.status})`}
        >
          {item.status}
        </button>
      </div>
      
      <div className="data-card__content">
        <div className="data-card__value">
          {formatValue(item.value, item.status)}
        </div>
        <div className="data-card__meta">
          <span className="data-card__category">{item.category}</span>
          <span className="data-card__timestamp">
            {item.timestamp.toLocaleDateString()}
          </span>
        </div>
      </div>
      
      {item.status !== 'complete' && (
        <div className="data-card__warning">
          <span className="data-card__warning-icon">⚠️</span>
          <span className="data-card__warning-text">
            {item.status === 'partial' ? 'Data incomplete' : 'Data missing'}
          </span>
        </div>
      )}
    </div>
  );
};