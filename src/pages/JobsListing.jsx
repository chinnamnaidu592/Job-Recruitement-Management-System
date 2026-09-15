import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, ArrowUpDown, Briefcase } from 'lucide-react';
import * as jobsApi from '../api/jobsApi';
import SearchBar from '../components/jobs/SearchBar';
import FilterPanel from '../components/jobs/FilterPanel';
import JobCard from '../components/jobs/JobCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

export const JobsListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'salaryHigh' | 'salaryLow'

  // Read current query params from URL
  const search = searchParams.get('search') || '';
  const location = searchParams.get('location') || '';
  const category = searchParams.get('category') || '';
  const jobType = searchParams.get('jobType') || '';
  const experience = searchParams.get('experience') || '';
  const salary = searchParams.get('salary') || '';

  const activeFilters = {
    search,
    location,
    category,
    jobType,
    experience,
    salary,
  };

  // Fetch jobs whenever query params change
  useEffect(() => {
    let isMounted = true;
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {};
        if (search) params.search = search;
        if (location) params.location = location;
        if (category) params.category = category;
        if (jobType) params.jobType = jobType;
        if (experience) params.experience = experience;
        if (salary) params.salary = salary;

        const data = await jobsApi.getJobs(params);
        if (isMounted) {
          setJobs(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch job opportunities');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, [search, location, category, jobType, experience, salary]);

  // Update query params in URL
  const updateUrlParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        updated.set(key, val);
      } else {
        updated.delete(key);
      }
    });

    setSearchParams(updated);
  };

  const handleSearch = ({ search: newSearch, location: newLocation }) => {
    updateUrlParams({ search: newSearch, location: newLocation });
  };

  const handleFilterChange = (newFilters) => {
    updateUrlParams(newFilters);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const removeSingleFilter = (key) => {
    const updated = new URLSearchParams(searchParams);
    updated.delete(key);
    setSearchParams(updated);
  };

  // Client-side sorting for responsive UX
  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === 'salaryHigh') {
      return (b.salaryMax || 0) - (a.salaryMax || 0);
    }
    if (sortBy === 'salaryLow') {
      return (a.salaryMin || 0) - (b.salaryMin || 0);
    }
    // Default newest by postedDate
    return new Date(b.postedDate || 0) - new Date(a.postedDate || 0);
  });

  const activeFilterChips = Object.entries(activeFilters).filter(
    ([, val]) => Boolean(val)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Search & Headline */}
      <div>
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Open Opportunities
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Search across top tech employers and find your next engineering or design role.
          </p>
        </div>

        <SearchBar
          initialSearch={search}
          initialLocation={location}
          onSearch={handleSearch}
        />
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-800">
            {loading ? 'Searching...' : `${sortedJobs.length} ${sortedJobs.length === 1 ? 'Job' : 'Jobs'} Found`}
          </span>

          {/* Mobile Filter Toggle Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center gap-1.5 text-xs"
            leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
          >
            Filters {activeFilterChips.length > 0 && `(${activeFilterChips.length})`}
          </Button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500 hidden sm:inline flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            Sort by:
          </span>
          <select
            id="sort-jobs-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Most Recent</option>
            <option value="salaryHigh">Highest Salary</option>
            <option value="salaryLow">Lowest Salary</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-500">Active filters:</span>
          {activeFilterChips.map(([key, val]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200"
            >
              <span className="capitalize">{key}:</span>
              <strong className="font-semibold">{val}</strong>
              <button
                type="button"
                onClick={() => removeSingleFilter(key)}
                className="p-0.5 hover:bg-indigo-200 rounded-full cursor-pointer text-indigo-600"
                aria-label={`Remove filter ${key}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline ml-2 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar Filters + Jobs List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filter Panel */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterPanel
            filters={activeFilters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            totalResults={sortedJobs.length}
          />
        </div>

        {/* Mobile Filter Drawer / Modal */}
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
            <div className="w-full max-w-xs sm:max-w-sm bg-white h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-base">Filter Roles</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterPanel
                filters={activeFilters}
                onFilterChange={(newFilters) => {
                  handleFilterChange(newFilters);
                }}
                onReset={() => {
                  handleResetFilters();
                  setMobileFiltersOpen(false);
                }}
              />

              <div className="pt-4 border-t border-slate-100">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  View {sortedJobs.length} Results
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Grid Container */}
        <div className="lg:col-span-3 space-y-6">
          {loading && (
            <LoadingState
              message="Searching job listings with your filter criteria..."
              type="skeleton"
              count={6}
            />
          )}

          {error && (
            <ErrorState
              title="Unable to load jobs"
              message={error}
              onRetry={() => {
                setLoading(true);
                jobsApi
                  .getJobs(activeFilters)
                  .then((data) => setJobs(data))
                  .catch((err) => setError(err.message))
                  .finally(() => setLoading(false));
              }}
            />
          )}

          {!loading && !error && sortedJobs.length === 0 && (
            <EmptyState
              title="No jobs found matching your criteria"
              message="Try broadening your search keywords, adjusting minimum salary, or clearing filter attributes."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}

          {!loading && !error && sortedJobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsListing;
