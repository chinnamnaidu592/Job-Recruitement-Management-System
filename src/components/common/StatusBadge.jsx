import React from 'react';
import { Clock, CheckCircle2, AlertCircle, XCircle, ShieldCheck } from 'lucide-react';

/**
 * StatusBadge component with dynamic styling based on application/job status
 * @param {string} status - 'Applied' | 'Under Review' | 'Shortlisted' | 'Rejected' | 'Active' | 'Closed'
 * @param {string} size - 'sm' | 'md'
 */
export const StatusBadge = ({ status = 'Applied', size = 'md', className = '' }) => {
  const normalized = (status || '').trim().toLowerCase();

  let styles = 'bg-blue-50 text-blue-700 border-blue-200';
  let Icon = Clock;
  let label = status;

  if (normalized === 'applied') {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
    Icon = Clock;
  } else if (normalized === 'under review' || normalized === 'review') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    Icon = AlertCircle;
  } else if (normalized === 'shortlisted') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    Icon = CheckCircle2;
  } else if (normalized === 'rejected') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
    Icon = XCircle;
  } else if (normalized === 'active') {
    styles = 'bg-teal-50 text-teal-700 border-teal-200';
    Icon = ShieldCheck;
  } else if (normalized === 'closed') {
    styles = 'bg-slate-100 text-slate-600 border-slate-200';
    Icon = XCircle;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${styles} ${sizeClasses} ${className} whitespace-nowrap font-medium`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
