import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * Presentational error state component with retry action
 * @param {string} title
 * @param {string} message
 * @param {Function} onRetry
 */
export const ErrorState = ({
  title = 'Something went wrong',
  message = 'Unable to load data from the server. Please check your connection and try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`min-h-[300px] flex flex-col items-center justify-center p-8 bg-rose-50/50 rounded-2xl border border-rose-100 text-center max-w-lg mx-auto my-8 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-slate-600 text-sm mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          leftIcon={<RefreshCw className="w-4 h-4" />}
          className="border-rose-200 text-rose-700 hover:bg-rose-100 hover:border-rose-300"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
