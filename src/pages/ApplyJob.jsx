import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Send,
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  FileText,
  User,
  Mail,
  Phone,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import * as jobsApi from '../api/jobsApi';
import * as applicationsApi from '../api/applicationsApi';
import Button from '../components/common/Button';
import LoadingState from '../components/common/LoadingState';

export const ApplyJob = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      candidateName: '',
      email: '',
      phone: '',
      experience: '3-5 years',
      resumeUrl: '',
      coverLetter: '',
      skills: '',
    },
    mode: 'onTouched',
  });

  // Fetch job details for header context
  useEffect(() => {
    let isMounted = true;
    const fetchJob = async () => {
      try {
        setJobLoading(true);
        const data = await jobsApi.getJobById(jobId);
        if (isMounted) {
          setJob(data);
        }
      } catch (err) {
        console.warn('Could not fetch job metadata for apply page:', err.message);
      } finally {
        if (isMounted) {
          setJobLoading(false);
        }
      }
    };

    if (jobId) {
      fetchJob();
    }

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  const onSubmit = async (formData) => {
    setSubmitError(null);
    try {
      const payload = {
        ...formData,
        jobId: String(jobId),
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Applied',
      };

      await applicationsApi.createApplication(payload);
      setSubmitSuccess(true);
      reset();
    } catch (err) {
      setSubmitError(
        err?.message || 'Failed to submit application. Please verify your data and try again.'
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <Link
        to={jobId ? `/jobs/${jobId}` : '/jobs'}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {job?.title ? `"${job.title}"` : 'Job Listing'}</span>
      </Link>

      {/* Target Job Header Card */}
      {job && !jobLoading && (
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 flex items-center gap-4">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-12 h-12 rounded-xl object-cover border border-indigo-200 bg-white shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Building className="w-6 h-6" />
            </div>
          )}
          <div>
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
              Submitting Candidacy For
            </span>
            <h2 className="text-lg font-bold text-slate-900">{job.title}</h2>
            <p className="text-xs text-slate-600">
              {job.company} • {job.location} • {job.salary}
            </p>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="mb-6 pb-6 border-b border-slate-100">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Candidate Application Form
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete the form below to submit your profile directly to the hiring team.
          </p>
        </div>

        {/* Success Alert Banner */}
        {submitSuccess ? (
          <div
            id="apply-success-alert"
            className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4 animate-in fade-in"
          >
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Application Submitted!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                Your application for <strong>{job?.title || 'this role'}</strong> has been registered successfully. The recruitment team will review your profile shortly.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/applications"
                id="view-submitted-applications-btn"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-colors"
              >
                Track My Applications
              </Link>
              <Link
                to="/jobs"
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors"
              >
                Explore More Jobs
              </Link>
            </div>
          </div>
        ) : (
          <form id="apply-job-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Submission Error Banner */}
            {submitError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{submitError}</p>
              </div>
            )}

            {/* Candidate Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="candidateName"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
              >
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="candidateName"
                  type="text"
                  placeholder="e.g. Maya Lin"
                  {...register('candidateName', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Full name must be at least 2 characters',
                    },
                    maxLength: {
                      value: 60,
                      message: 'Full name cannot exceed 60 characters',
                    },
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    errors.candidateName
                      ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                      : 'border-slate-200 focus:ring-indigo-500 bg-white'
                  }`}
                />
              </div>
              {errors.candidateName && (
                <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.candidateName.message}</span>
                </p>
              )}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="maya.lin@example.com"
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address',
                      },
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                        : 'border-slate-200 focus:ring-indigo-500 bg-white'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email.message}</span>
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/,
                        message: 'Please enter a valid phone number (at least 7 digits)',
                      },
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                        : 'border-slate-200 focus:ring-indigo-500 bg-white'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.phone.message}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Experience Band & Resume URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Experience Band */}
              <div className="space-y-1.5">
                <label
                  htmlFor="experience"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  Years of Relevant Experience
                </label>
                <select
                  id="experience"
                  {...register('experience')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="0-1 years">0 - 1 years (Entry / New Grad)</option>
                  <option value="1-3 years">1 - 3 years (Junior / Associate)</option>
                  <option value="3-5 years">3 - 5 years (Mid Level)</option>
                  <option value="5-8 years">5 - 8 years (Senior)</option>
                  <option value="8+ years">8+ years (Staff / Principal / Lead)</option>
                </select>
              </div>

              {/* Resume URL */}
              <div className="space-y-1.5">
                <label
                  htmlFor="resumeUrl"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  Resume / Portfolio URL <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    id="resumeUrl"
                    type="url"
                    placeholder="https://drive.google.com/... or linkedin.com/in/..."
                    {...register('resumeUrl', {
                      required: 'Resume or portfolio link is required',
                      pattern: {
                        value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i,
                        message: 'Please provide a valid web URL',
                      },
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      errors.resumeUrl
                        ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                        : 'border-slate-200 focus:ring-indigo-500 bg-white'
                    }`}
                  />
                </div>
                {errors.resumeUrl && (
                  <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.resumeUrl.message}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Core Skills */}
            <div className="space-y-1.5">
              <label
                htmlFor="skills"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
              >
                Top Relevant Skills & Tools
              </label>
              <input
                id="skills"
                type="text"
                placeholder="e.g. React, TypeScript, Tailwind CSS, Next.js, Redux"
                {...register('skills')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400">Comma-separated key competencies</p>
            </div>

            {/* Cover Letter */}
            <div className="space-y-1.5">
              <label
                htmlFor="coverLetter"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
              >
                Cover Note / Pitch Statement
              </label>
              <textarea
                id="coverLetter"
                rows={4}
                placeholder="Share a brief introduction, notable projects, or why you are excited about this opportunity..."
                {...register('coverLetter', {
                  minLength: {
                    value: 20,
                    message: 'Cover letter should contain at least 20 characters if provided',
                  },
                  maxLength: {
                    value: 1200,
                    message: 'Cover letter cannot exceed 1,200 characters',
                  },
                })}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                  errors.coverLetter
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-200 focus:ring-indigo-500 bg-white'
                }`}
              />
              {errors.coverLetter && (
                <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.coverLetter.message}</span>
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                By submitting, your profile will be sent directly to the hiring team.
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => navigate(-1)}
                  className="flex-1 sm:flex-initial"
                >
                  Cancel
                </Button>
                <Button
                  id="submit-application-btn"
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" />}
                  className="flex-1 sm:flex-initial px-6"
                >
                  Submit Application
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyJob;
