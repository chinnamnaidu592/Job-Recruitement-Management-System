import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Presentational loading state component
 * @param {string} message - Custom loading text
 * @param {string} type - 'spinner' | 'skeleton'
 * @param {number} count - Count of skeleton cards to display
 */
export const LoadingState = ({
  message = 'Loading jobs...',
  type = 'spinner',
  count = 4,
  className = '',
}) => {
  if (type === 'skeleton') {
    return (
      <div className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="p-6 bg-white rounded-xl border border-slate-200 animate-pulse flex flex-col justify-between h-56"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="h-3 bg-slate-100 rounded w-full"></div>
                <div className="h-3 bg-slate-100 rounded w-5/6"></div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <div className="h-4 bg-slate-200 rounded w-24"></div>
              <div className="h-8 bg-slate-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`min-h-[280px] flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4 text-indigo-600 shadow-sm">
        <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
      </div>
      <p className="text-slate-700 font-medium text-base mb-1">{message}</p>
      <p className="text-slate-400 text-sm">Please hold on while we fetch the latest records</p>
    </div>
  );
};

export default LoadingState;
