import React from 'react';
import { AppError } from '../../types';
import './ErrorMessage.css';

interface ErrorMessageProps {
  error: AppError;
  onRetry?: () => void;
  className?: string;
}

/**
 * Reusable error message component
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`error-message ${className}`}>
      <div className="error-message__icon">⚠️</div>
      <div className="error-message__content">
        <h3 className="error-message__title">Error</h3>
        <p className="error-message__text">{error.message}</p>
        {error.code && (
          <p className="error-message__code">Code: {error.code}</p>
        )}
        {onRetry && (
          <button
            className="error-message__retry-btn"
            onClick={onRetry}
            type="button"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};