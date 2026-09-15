import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Bookmark, Building, ChevronRight, Briefcase } from 'lucide-react';
import { useSavedJobs } from '../../context/SavedJobsContext';
import StatusBadge from '../common/StatusBadge';

/**
 * JobCard component
 * @param {Object} job - Job object
 * @param {boolean} showFullDetails - When true, renders detailed badges
 */
export const JobCard = ({ job, className = '' }) => {
  const { isSaved, toggleSaveJob } = useSavedJobs();
  const saved = isSaved(job?.id);

  if (!job) return null;

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveJob(job);
  };

  return (
    <div
      id={`job-card-${job.id}`}
      className={`group bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between relative ${className}`}
    >
      <div>
        {/* Header: Company Logo, Info & Save Button */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {job.companyLogo ? (
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
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-slate-500 truncate">{job.company}</h4>
              <Link
                to={`/jobs/${job.id}`}
                className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1"
              >
                {job.title}
              </Link>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            id={`bookmark-job-btn-${job.id}`}
            type="button"
            onClick={handleBookmark}
            aria-label={saved ? 'Remove from saved jobs' : 'Save job'}
            title={saved ? 'Remove from saved jobs' : 'Save job'}
            className={`p-2 rounded-lg transition-colors shrink-0 cursor-pointer ${
              saved
                ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Badges / Meta Info */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-slate-600 mb-4">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[140px]">{job.location}</span>
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
            <span>{job.salary}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.jobType}</span>
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Pills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {job.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-400">
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Posted date & Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Posted {job.postedDate || 'recently'}
          </span>
          {job.experience && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
              {job.experience}
            </span>
          )}
        </div>

        <Link
          to={`/jobs/${job.id}`}
          id={`view-job-link-${job.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span>View Job</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
