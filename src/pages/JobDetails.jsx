import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building,
  MapPin,
  Briefcase,
  Award,
  Calendar,
  Bookmark,
  CheckCircle2,
  Gift,
  ArrowLeft,
  Share2,
  Send,
  ShieldCheck,
} from 'lucide-react';
import * as jobsApi from '../api/jobsApi';
import { useSavedJobs } from '../context/SavedJobsContext';
import Button from '../components/common/Button';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

export const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSaveJob } = useSavedJobs();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await jobsApi.getJobById(id);
        if (isMounted) {
          setJob(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || `Unable to find job listing with ID "${id}"`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchJob();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const saved = job ? isSaved(job.id) : false;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingState message="Fetching detailed job specifications..." type="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState
          title="Job Listing Unavailable"
          message={error}
          onRetry={() => {
            setLoading(true);
            jobsApi
              .getJobById(id)
              .then(setJob)
              .catch((e) => setError(e.message))
              .finally(() => setLoading(false));
          }}
        />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          title="Job Not Found"
          message={`The job position with ID #${id} might have expired or been removed.`}
          actionText="Browse Available Jobs"
          onAction={() => navigate('/jobs')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back to listings bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/jobs"
          id="back-to-jobs-btn"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Jobs</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Link Copied!' : 'Share Position'}</span>
        </button>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Building className="w-8 h-8" />
              </div>
            )}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                {job.category || 'Engineering'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {job.title}
              </h1>
              <p className="text-base font-semibold text-slate-600 mt-1 flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400" />
                {job.company}
              </p>
            </div>
          </div>

          {/* Action CTAs: Apply Now & Save Job */}
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              id="job-details-save-btn"
              type="button"
              onClick={() => toggleSaveJob(job)}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-150 cursor-pointer ${
                saved
                  ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current text-amber-600' : ''}`} />
              <span>{saved ? 'Saved Role' : 'Save Job'}</span>
            </button>

            <Link
              to={`/apply/${job.id}`}
              id="job-details-apply-btn"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all duration-150"
            >
              <Send className="w-4 h-4" />
              <span>Apply Now</span>
            </Link>
          </div>
        </div>

        {/* Highlight Metadata Badges */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px] font-medium flex items-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              Workplace / Location
            </span>
            <span className="font-bold text-slate-800">{job.location}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px] font-medium flex items-center gap-1 mb-1">
              Base Salary Band
            </span>
            <span className="font-bold text-emerald-700">{job.salary}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px] font-medium flex items-center gap-1 mb-1">
              <Briefcase className="w-3.5 h-3.5" />
              Job Type
            </span>
            <span className="font-bold text-slate-800">{job.jobType}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px] font-medium flex items-center gap-1 mb-1">
              <Award className="w-3.5 h-3.5" />
              Experience Level
            </span>
            <span className="font-bold text-slate-800">{job.experience}</span>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description, Requirements, Benefits */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Overview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Role Overview</h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {job.description}
            </p>
          </div>

          {/* Requirements List */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Role Requirements & Qualifications
              </h2>
              <ul className="space-y-3">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits & Perks */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Gift className="w-5 h-5 text-indigo-600" />
                Benefits & Compensation Perks
              </h2>
              <ul className="space-y-3">
                {job.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right 1 Col: Tech Stack, Company Profile & Application CTA */}
        <div className="space-y-6">
          {/* Required Skills & Tech Stack */}
          {job.skills && job.skills.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                Required Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Info Widget */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">Listing Summary</h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Position ID</span>
                <span className="font-semibold text-slate-800">#{job.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Posted Date</span>
                <span className="font-semibold text-slate-800">{job.postedDate || 'Active'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Department</span>
                <span className="font-semibold text-slate-800">{job.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Hiring Status</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Actively Recruiting
                </span>
              </div>
            </div>

            <Link
              to={`/apply/${job.id}`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Apply for this Role</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
