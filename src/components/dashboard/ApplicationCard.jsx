import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  Calendar,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  ChevronDown,
  User,
  Briefcase,
  Trash2,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

/**
 * ApplicationCard component for applications list & dashboard
 * @param {Object} application - Application record
 * @param {Object} job - Resolved job record
 * @param {Function} onStatusChange - Optional callback to update status
 */
export const ApplicationCard = ({
  application,
  job,
  onStatusChange,
  onDelete,
  isRecruiterView = false,
  className = '',
}) => {
  const [updating, setUpdating] = useState(false);

  if (!application) return null;

  const handleSelectStatus = async (e) => {
    const newStatus = e.target.value;
    if (onStatusChange && newStatus !== application.status) {
      setUpdating(true);
      try {
        await onStatusChange(application.id, newStatus);
      } finally {
        setUpdating(false);
      }
    }
  };

  return (
    <div
      id={`application-card-${application.id}`}
      className={`bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow transition-all duration-200 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
        {/* Job & Company Info */}
        <div className="flex items-start gap-3.5">
          {job?.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-12 h-12 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Building className="w-6 h-6" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {job ? (
                  <Link
                    to={`/jobs/${job.id}`}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {job.title}
                  </Link>
                ) : (
                  `Job #${application.jobId}`
                )}
              </h3>
            </div>
            <p className="text-sm font-medium text-slate-500">
              {job?.company || 'Company details unavailable'} • {job?.location || 'Remote'}
            </p>
          </div>
        </div>

        {/* Status Badge & Status Selector */}
        <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 shrink-0">
          <StatusBadge status={application.status} size="md" />

          {/* Quick status update select for recruiters/reviewers */}
          {onStatusChange && (
            <div className="relative mt-1">
              <select
                id={`update-status-select-${application.id}`}
                value={application.status}
                onChange={handleSelectStatus}
                disabled={updating}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Applied">Status: Applied</option>
                <option value="Under Review">Status: Under Review</option>
                <option value="Shortlisted">Status: Shortlisted</option>
                <option value="Rejected">Status: Rejected</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Details */}
      <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-semibold text-slate-800 truncate">
            {application.candidateName}
          </span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{application.email}</span>
        </div>
        {application.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{application.phone}</span>
          </div>
        )}
      </div>

      {/* Cover Letter Snippet */}
      {application.coverLetter && (
        <div className="mb-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-100">
          <span className="font-semibold text-slate-700 block mb-0.5">Note / Pitch:</span>
          <p className="line-clamp-2">{application.coverLetter}</p>
        </div>
      )}

      {/* Skills or Experience */}
      {application.skills && (
        <div className="mb-4 flex flex-wrap gap-1 text-[11px]">
          <span className="text-slate-400 mr-1 self-center">Skills:</span>
          {application.skills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .slice(0, 4)
            .map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium"
              >
                {skill}
              </span>
            ))}
        </div>
      )}

      {/* Card Footer: Applied Date & Resume link */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          Submitted on {application.appliedDate || 'Recently'}
        </span>

        {application.resumeUrl && (
          <a
            href={application.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Resume</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
        {application.status?.toLowerCase() === 'rejected' && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(application.id)}
            className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
            aria-label="Delete rejected application"
            title="Delete rejected application"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
