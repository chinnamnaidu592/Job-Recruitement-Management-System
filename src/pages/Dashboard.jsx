import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Bookmark,
  Briefcase,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import * as applicationsApi from '../api/applicationsApi';
import * as jobsApi from '../api/jobsApi';
import { useSavedJobs } from '../context/SavedJobsContext';
import DashboardCard from '../components/dashboard/DashboardCard';
import ApplicationCard from '../components/dashboard/ApplicationCard';
import JobCard from '../components/jobs/JobCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import Button from '../components/common/Button';

export const Dashboard = () => {
  const { savedJobs } = useSavedJobs();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobsMap, setJobsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [appsData, jobsData] = await Promise.all([
        applicationsApi.getApplications(),
        jobsApi.getJobs(),
      ]);

      const map = {};
      if (Array.isArray(jobsData)) {
        jobsData.forEach((j) => {
          map[String(j.id)] = j;
        });
      }

      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setJobsMap(map);
      setApplications(Array.isArray(appsData) ? appsData : []);
    } catch (err) {
      setError(err?.message || 'Failed to fetch recruitment analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute metrics
  const totalApplied = applications.length;
  const shortlistedCount = applications.filter(
    (a) => a.status?.toLowerCase() === 'shortlisted'
  ).length;
  const underReviewCount = applications.filter(
    (a) =>
      a.status?.toLowerCase() === 'under review' || a.status?.toLowerCase() === 'review'
  ).length;
  const rejectedCount = applications.filter(
    (a) => a.status?.toLowerCase() === 'rejected'
  ).length;
  const pendingAppliedCount = applications.filter(
    (a) => a.status?.toLowerCase() === 'applied'
  ).length;

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationsApi.updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((a) => (String(a.id) === String(appId) ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert(`Could not update status: ${err.message}`);
    }
  };

  const handleDelete = async (appId) => {
    if (!window.confirm('Delete this rejected application permanently?')) return;

    try {
      await applicationsApi.deleteApplication(appId);
      setApplications((prev) => prev.filter((app) => String(app.id) !== String(appId)));
    } catch (err) {
      alert(`Could not delete application: ${err.message}`);
    }
  };

  // Recent applications (first 3)
  const recentApplications = applications.slice(0, 3);

  // Success rate computation
  const resolvedCount = shortlistedCount + rejectedCount;
  const shortlistRate =
    totalApplied > 0 ? Math.round((shortlistedCount / totalApplied) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Recruitment Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recruitment & Pipeline Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time telemetry and overview of your candidate applications and saved roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Search Jobs</span>
          </Link>
        </div>
      </div>

      {loading && (
        <LoadingState message="Calculating recruitment pipeline metrics..." type="spinner" />
      )}

      {error && (
        <ErrorState
          title="Could not load dashboard telemetry"
          message={error}
          onRetry={fetchDashboardData}
        />
      )}

      {!loading && !error && (
        <>
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <DashboardCard
              label="Total Applied"
              value={totalApplied}
              icon={<Send className="w-6 h-6" />}
              color="blue"
              description="Total candidacies submitted"
            />
            <DashboardCard
              label="Under Review"
              value={underReviewCount}
              icon={<Clock className="w-6 h-6" />}
              color="amber"
              description="Awaiting recruiter decision"
            />
            <DashboardCard
              label="Shortlisted"
              value={shortlistedCount}
              icon={<CheckCircle2 className="w-6 h-6" />}
              color="emerald"
              description={`${shortlistRate}% conversion rate`}
            />
            <DashboardCard
              label="Rejected"
              value={rejectedCount}
              icon={<XCircle className="w-6 h-6" />}
              color="rose"
              description="Closed candidate applications"
            />
          </div>

          {/* Pipeline Funnel / Distribution Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Application Pipeline Status</h3>
                <p className="text-xs text-slate-500">
                  Distribution of current candidate workflows
                </p>
              </div>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full self-start sm:self-auto">
                {totalApplied} Total Records
              </span>
            </div>

            {totalApplied > 0 ? (
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  {pendingAppliedCount > 0 && (
                    <div
                      style={{ width: `${(pendingAppliedCount / totalApplied) * 100}%` }}
                      className="bg-blue-500 h-full transition-all duration-500"
                      title={`Applied: ${pendingAppliedCount}`}
                    />
                  )}
                  {underReviewCount > 0 && (
                    <div
                      style={{ width: `${(underReviewCount / totalApplied) * 100}%` }}
                      className="bg-amber-400 h-full transition-all duration-500"
                      title={`Under Review: ${underReviewCount}`}
                    />
                  )}
                  {shortlistedCount > 0 && (
                    <div
                      style={{ width: `${(shortlistedCount / totalApplied) * 100}%` }}
                      className="bg-emerald-500 h-full transition-all duration-500"
                      title={`Shortlisted: ${shortlistedCount}`}
                    />
                  )}
                  {rejectedCount > 0 && (
                    <div
                      style={{ width: `${(rejectedCount / totalApplied) * 100}%` }}
                      className="bg-rose-500 h-full transition-all duration-500"
                      title={`Rejected: ${rejectedCount}`}
                    />
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-2 gap-y-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                    <span>Applied: {pendingAppliedCount}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                    <span>Under Review: {underReviewCount}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                    <span>Shortlisted: {shortlistedCount}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                    <span>Rejected: {rejectedCount}</span>
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No applications submitted yet.</p>
            )}
          </div>

          {/* Dual Columns: Recent Applications + Saved Jobs Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Recent Applications */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
                  <p className="text-xs text-slate-500">Latest candidate submissions</p>
                </div>
                <Link
                  to="/applications"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <span>View All ({totalApplied})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentApplications.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
                  <p>No recent applications found.</p>
                  <Link
                    to="/jobs"
                    className="inline-block mt-3 text-xs font-semibold text-indigo-600 underline"
                  >
                    Browse jobs and submit your first application
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      job={jobsMap[String(app.jobId)]}
                      onStatusChange={handleStatusChange}
                          onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right 1 Col: Saved Jobs Summary & Quick Actions */}
            <div className="space-y-6">
              {/* Saved Jobs Widget */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-indigo-600 fill-current" />
                    <h3 className="font-bold text-slate-900 text-sm">Saved Jobs Summary</h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {savedJobs.length} {savedJobs.length === 1 ? 'Role' : 'Roles'}
                  </span>
                </div>

                {savedJobs.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">
                    No saved jobs. Click the bookmark icon on any job card to save it for quick access.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {savedJobs.slice(0, 4).map((job) => (
                      <div
                        key={job.id}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <Link
                            to={`/jobs/${job.id}`}
                            className="text-xs font-bold text-slate-800 hover:text-indigo-600 truncate block"
                          >
                            {job.title}
                          </Link>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {job.company} • {job.salary}
                          </span>
                        </div>
                        <Link
                          to={`/apply/${job.id}`}
                          className="shrink-0 px-2.5 py-1 text-[11px] font-semibold rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                        >
                          Apply
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    to="/saved-jobs"
                    className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 py-1"
                  >
                    <span>Manage Saved Jobs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Portal Quick Links Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-slate-50 rounded-2xl border border-indigo-100 p-5 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  Quick Shortcuts
                </h4>
                <div className="space-y-2 text-xs">
                  <Link
                    to="/jobs?category=Frontend"
                    className="block p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 font-medium transition-colors"
                  >
                    → Frontend Engineering Jobs
                  </Link>
                  <Link
                    to="/jobs?location=Remote"
                    className="block p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 font-medium transition-colors"
                  >
                    → Remote-Only Openings
                  </Link>
                  <Link
                    to="/jobs?salary=130000"
                    className="block p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 font-medium transition-colors"
                  >
                    → High Compensation ($130k+)
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
