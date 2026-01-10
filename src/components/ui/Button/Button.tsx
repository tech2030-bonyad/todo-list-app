import React, { forwardRef } from 'react';
import { BaseComponentProps } from '../../../types';
import './Button.css';

/**
 * Reusable Button component with multiple variants and sizes
 * Supports loading states, icons, and accessibility features
 */
interface ButtonProps extends BaseComponentProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      testId,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'btn';
    const variantClass = `btn--${variant}`;
    const sizeClass = `btn--${size}`;
    const fullWidthClass = fullWidth ? 'btn--full-width' : '';
    const loadingClass = loading ? 'btn--loading' : '';
    
    const combinedClassName = [
      baseClasses,
      variantClass,
      sizeClass,
      fullWidthClass,
      loadingClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || loading}
        data-testid={testId}
        aria-busy={loading}
        {...props}
      >
        {loading && <span className="btn__spinner" aria-hidden="true" />}
        {leftIcon && !loading && <span className="btn__icon btn__icon--left">{leftIcon}</span>}
        <span className="btn__content">{children}</span>
        {rightIcon && !loading && <span className="btn__icon btn__icon--right">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';