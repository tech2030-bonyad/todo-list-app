import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
}

/**
 * Reusable loading spinner component
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#007bff',
  message = 'Loading...'
}) => {
  return (
    <div className="loading-spinner">
      <div 
        className={`loading-spinner__spinner loading-spinner__spinner--${size}`}
        style={{ borderTopColor: color }}
      />
      {message && (
        <p className="loading-spinner__message">{message}</p>
      )}
    </div>
  );
};