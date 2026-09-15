import React from 'react';
import { SearchX } from 'lucide-react';
import Button from './Button';

/**
 * Presentational empty state component
 * @param {string} title
 * @param {string} message
 * @param {string} actionText
 * @param {Function} onAction
 * @param {React.ReactNode} icon
 */
export const EmptyState = ({
  title = 'No results found',
  message = 'We couldn’t find any matching records. Try tweaking your search filters.',
  actionText,
  onAction,
  icon,
  className = '',
}) => {
  return (
    <div
      className={`min-h-[300px] flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-slate-200 text-center max-w-lg mx-auto my-8 ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
        {icon || <SearchX className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-sm">{message}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="secondary" size="md">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
