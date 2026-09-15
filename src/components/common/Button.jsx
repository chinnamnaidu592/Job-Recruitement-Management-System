import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} isLoading - Shows spinner and disables button
 * @param {boolean} disabled
 * @param {React.ReactNode} leftIcon
 * @param {React.ReactNode} rightIcon
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  onClick,
  id,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none rounded-lg cursor-pointer whitespace-nowrap';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm focus:ring-indigo-500',
    secondary:
      'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 focus:ring-slate-400',
    outline:
      'border border-slate-300 hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 text-slate-700 focus:ring-indigo-500 bg-white',
    danger:
      'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm focus:ring-rose-500',
    ghost:
      'bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-600 hover:text-slate-900 focus:ring-slate-400',
  };

  const chosenVariant = variantClasses[variant] || variantClasses.primary;
  const chosenSize = sizeClasses[size] || sizeClasses.md;

  return (
    <button
      id={id}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${chosenSize} ${chosenVariant} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
