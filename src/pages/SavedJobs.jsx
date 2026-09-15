import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ArrowRight, Sparkles, Building, MapPin, DollarSign, Briefcase } from 'lucide-react';
import { useSavedJobs } from '../context/SavedJobsContext';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';

export const SavedJobs = () => {
  const { savedJobs, removeJob } = useSavedJobs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Bookmark className="w-5 h-5 fill-current" />
            <span className="text-xs font-bold uppercase tracking-wider">Saved Positions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bookmarked Opportunities
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Keep track of roles you want to review or apply for later.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {savedJobs.length} {savedJobs.length === 1 ? 'Job Saved' : 'Jobs Saved'}
          </span>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browse More Roles</span>
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {savedJobs.length === 0 ? (
        <EmptyState
          title="No saved jobs yet"
          message="You haven’t saved any job opportunities yet. Browse our open positions and bookmark the ones that match your career aspirations."
          actionText="Explore Jobs Directory"
          onAction={() => (window.location.href = '/jobs')}
          icon={<Bookmark className="w-8 h-8 text-slate-400" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              id={`saved-job-card-${job.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Company Logo and Title */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Building className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500">{job.company}</h4>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                      >
                        {job.title}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Metadata Pills */}
                <div className="space-y-1.5 py-3 border-y border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{job.jobType} • {job.experience}</span>
                  </div>
                </div>

                {job.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mt-3 leading-relaxed">
                    {job.description}
                  </p>
                )}
              </div>

              {/* Card Footer: Remove & Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  id={`remove-saved-job-${job.id}`}
                  type="button"
                  onClick={() => removeJob(job.id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove from Saved"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                  >
                    Details
                  </Link>
                  <Link
                    to={`/apply/${job.id}`}
                    id={`apply-saved-job-${job.id}`}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
