import React from 'react';

/**
 * DashboardCard component for KPI metrics
 * @param {string} label - Metric label
 * @param {number|string} value - Metric value
 * @param {React.ReactNode} icon - Icon element
 * @param {string} color - 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue'
 * @param {string} description - Optional secondary info
 */
export const DashboardCard = ({
  label,
  value,
  icon,
  color = 'indigo',
  description,
  className = '',
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex items-center justify-between gap-4 ${className}`}
    >
      <div className="space-y-1">
        <p className="text-xs sm:text-sm font-medium text-slate-500">{label}</p>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </h3>
        {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
      </div>

      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${scheme.bg} ${scheme.text} flex items-center justify-center shrink-0 shadow-sm`}
      >
        {icon}
      </div>
    </div>
  );
};

export default DashboardCard;
