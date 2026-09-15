import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Code,
  Server,
  Palette,
  BarChart3,
  Cloud,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import * as jobsApi from '../api/jobsApi';
import SearchBar from '../components/jobs/SearchBar';
import JobCard from '../components/jobs/JobCard';
import CategoryCard from '../components/jobs/CategoryCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

export const Home = () => {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await jobsApi.getJobs();
        if (isMounted) {
          setFeaturedJobs(Array.isArray(data) ? data.slice(0, 6) : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load featured jobs');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = ({ search, location }) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  const categories = [
    { name: 'Frontend', count: 4, icon: <Code className="w-6 h-6" /> },
    { name: 'Backend', count: 3, icon: <Server className="w-6 h-6" /> },
    { name: 'UI/UX Design', count: 2, icon: <Palette className="w-6 h-6" /> },
    { name: 'Data Analyst', count: 2, icon: <BarChart3 className="w-6 h-6" /> },
    { name: 'DevOps', count: 2, icon: <Cloud className="w-6 h-6" /> },
    { name: 'Mobile', count: 1, icon: <Smartphone className="w-6 h-6" /> },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-indigo-50/70 via-slate-50 to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/80 text-indigo-800 text-xs font-semibold mb-6 shadow-xs">
              <span>Job raledhu ani badhapaduthunnara! aithe ikapai badhapadakandi mikosam LCN job portal undi
                Where you can find your dream job in tech.
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Discover Your Next <span className="text-indigo-600">Career Opportunity</span> in Tech
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              ichata anni joblu labhinchunuu.
            </p>
          </div>

          {/* Search Bar Container */}
          <div className="max-w-4xl mx-auto shadow-lg shadow-indigo-100/60 rounded-2xl">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Popular Keyword Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Trending Searches:</span>
            {['React', 'Remote', 'Lead Engineer', 'Product Designer', 'DevOps'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleSearch({ search: tag, location: '' })}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors shadow-2xs"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 pt-8 border-t border-slate-200/70 grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">14+</p>
              <p className="text-xs font-medium text-slate-500">Verified Tech Openings</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-indigo-600">140k</p>
              <p className="text-xs font-medium text-slate-500">Average Base Comp</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">100%</p>
              <p className="text-xs font-medium text-slate-500">Transparent Salary Bands</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-indigo-600">&lt; 48 hrs</p>
              <p className="text-xs font-medium text-slate-500">Recruiter Response Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Popular Jobs 
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Where Fresher requires 100 years of AI experience
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors self-start sm:self-auto"
          >
            <span>Browse All Departments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              icon={category.icon}
              count={category.count}
            />
          ))}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Priority Listings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Opportunities
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top roles actively screening candidates this week
            </p>
          </div>

          <Link
            to="/jobs"
            id="home-view-all-jobs-btn"
            className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors self-start sm:self-auto"
          >
            <span>View All Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Content States */}
        {loading && <LoadingState message="Fetching featured job postings..." type="skeleton" count={6} />}

        {error && (
          <ErrorState
            title="Could not load featured jobs"
            message={error}
            onRetry={() => {
              setLoading(true);
              jobsApi
                .getJobs()
                .then((data) => setFeaturedJobs(data.slice(0, 6)))
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
            }}
          />
        )}

        {!loading && !error && featuredJobs.length === 0 && (
          <EmptyState
            title="No featured jobs available"
            message="Check back soon for new opportunities."
            actionText="Refresh Listings"
            onAction={() => window.location.reload()}
          />
        )}

        {!loading && !error && featuredJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Recruitment Value Proposition Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold mb-4 border border-indigo-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Recruitment Workflow Engine
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Stop Ghosting Yourself. Let Recruiters Do It For You.          </h2>
            <p className="text-indigo-100 text-sm sm:text-base mb-8 leading-relaxed">
              Stalk companies that will never hire you, monitor the exact millisecond your resume gets auto-rejected by an AI bot, and send your data into the corporate abyss in seconds with our useless recruitment portal.          </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/jobs"
                className="px-6 py-3 rounded-xl bg-white text-indigo-900 font-bold text-sm hover:bg-indigo-50 transition-colors shadow-sm"
              >
                Find Open Positions
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl bg-indigo-700/50 hover:bg-indigo-700 text-white font-bold text-sm border border-indigo-500/50 transition-colors"
              >
                View Recruitment Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
