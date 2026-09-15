import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, Filter, RefreshCw } from 'lucide-react';
import * as applicationsApi from '../api/applicationsApi';
import * as jobsApi from '../api/jobsApi';
import ApplicationCard from '../components/dashboard/ApplicationCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

export const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [jobsMap, setJobsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch applications and jobs concurrently
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

      setJobsMap(map);
      setApplications(Array.isArray(appsData) ? appsData : []);
    } catch (err) {
      setError(err?.message || 'Failed to fetch candidate applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const updated = await applicationsApi.updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (String(app.id) === String(appId) ? { ...app, status: newStatus } : app))
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

  const statuses = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Rejected'];

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === 'All') return true;
    return app.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <FileText className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Candidate Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Submitted Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time status updates across all submitted candidate applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Data
          </Button>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply to New Roles</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5" /> Filter by Status:
        </span>
        {statuses.map((st) => {
          const count =
            st === 'All'
              ? applications.length
              : applications.filter((a) => a.status?.toLowerCase() === st.toLowerCase()).length;

          const isActive = statusFilter === st;

          return (
            <button
              key={st}
              id={`filter-status-tab-${st.toLowerCase().replace(/\s+/g, '-')}`}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{st}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content States */}
      {loading && (
        <LoadingState
          message="Synchronizing application records with REST mock server..."
          type="spinner"
        />
      )}

      {error && (
        <ErrorState
          title="Could not load applications"
          message={error}
          onRetry={loadData}
        />
      )}

      {!loading && !error && filteredApplications.length === 0 && (
        <EmptyState
          title={statusFilter === 'All' ? 'No applications submitted yet' : `No applications in '${statusFilter}' status`}
          message={
            statusFilter === 'All'
              ? 'You have not submitted any applications yet. Find your dream role in our open directory and submit your application.'
              : `There are currently no candidate applications marked as '${statusFilter}'.`
          }
          actionText="Browse Open Jobs"
          onAction={() => (window.location.href = '/jobs')}
        />
      )}

      {!loading && !error && filteredApplications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredApplications.map((app) => {
            const resolvedJob = jobsMap[String(app.jobId)];
            return (
              <ApplicationCard
                key={app.id}
                application={app}
                job={resolvedJob}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
