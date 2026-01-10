import React from 'react';
import { BaseComponentProps } from '../../../types';
import './Card.css';

/**
 * Flexible Card component for displaying content in a contained layout
 * Supports headers, footers, and various styling options
 */
interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

interface CardHeaderProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

interface CardContentProps extends BaseComponentProps {}

interface CardFooterProps extends BaseComponentProps {
  align?: 'left' | 'center' | 'right' | 'between';
}

// Main Card component
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hoverable = false,
  testId,
}) => {
  const baseClasses = 'card';
  const variantClass = `card--${variant}`;
  const paddingClass = `card--padding-${padding}`;
  const hoverableClass = hoverable ? 'card--hoverable' : '';
  
  const combinedClassName = [
    baseClasses,
    variantClass,
    paddingClass,
    hoverableClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={combinedClassName} data-testid={testId}>
      {children}
    </div>
  );
};

// Card Header component
export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  title,
  subtitle,
  actions,
  testId,
}) => {
  const combinedClassName = ['card__header', className].filter(Boolean).join(' ');

  return (
    <div className={combinedClassName} data-testid={testId}>
      <div className="card__header-content">
        {title && <h3 className="card__title">{title}</h3>}
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
        {children}
      </div>
      {actions && <div className="card__header-actions">{actions}</div>}
    </div>
  );
};

// Card Content component
export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  testId,
}) => {
  const combinedClassName = ['card__content', className].filter(Boolean).join(' ');

  return (
    <div className={combinedClassName} data-testid={testId}>
      {children}
    </div>
  );
};

// Card Footer component
export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  align = 'left',
  testId,
}) => {
  const baseClasses = 'card__footer';
  const alignClass = `card__footer--${align}`;
  const combinedClassName = [baseClasses, alignClass, className].filter(Boolean).join(' ');

  return (
    <div className={combinedClassName} data-testid={testId}>
      {children}
    </div>
  );
};