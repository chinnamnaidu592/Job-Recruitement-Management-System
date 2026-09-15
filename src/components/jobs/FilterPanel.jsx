import React from 'react';
import { Filter, RotateCcw, Briefcase, Award, Layers, DollarSign, MapPin, IndianRupeeIcon } from 'lucide-react';
import Button from '../common/Button';

/**
 * FilterPanel component
 * @param {Object} filters - current filter state: { jobType, experience, category, salary, location }
 * @param {Function} onFilterChange - callback receiving updated filters
 * @param {Function} onReset - callback to reset all filters
 */
export const FilterPanel = ({
  filters = {},
  onFilterChange,
  onReset,
  totalResults = 0,
  className = '',
}) => {
  const jobTypes = ['Full-Time', 'Part-Time', 'Contract', 'Internship'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior', 'Lead'];
  const categories = [
    'Frontend',
    'Backend',
    'Full Stack',
    'UI/UX Design',
    'Data Analyst',
    'Data Science',
    'DevOps',
    'Mobile',
    'Product Management',
  ];
  const salaryOptions = [
    { label: 'Any Salary', value: '' },
    { label: '60,000+ / yr', value: '60000' },
    { label: '1,00,000+ / yr', value: '100000' },
    { label: '1,30,000+ / yr', value: '130000' },
    { label: '1,60,000+ / yr', value: '160000' },
  ];

  const handleFieldChange = (key, value) => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        [key]: value,
      });
    }
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([k, v]) => k !== 'search' && Boolean(v)
  );

  return (
    <div
      id="jobs-filter-panel"
      className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Filters & Refinements</h3>
        </div>
        {hasActiveFilters && (
          <button
            id="reset-filters-btn"
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          Department / Category
        </label>
        <select
          id="filter-category-select"
          value={filters.category || ''}
          onChange={(e) => handleFieldChange('category', e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Job Type */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          Employment Type
        </label>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-indigo-600">
            <input
              type="radio"
              name="jobType"
              checked={!filters.jobType}
              onChange={() => handleFieldChange('jobType', '')}
              className="text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
            />
            <span>All Types</span>
          </label>
          {jobTypes.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-indigo-600"
            >
              <input
                type="radio"
                name="jobType"
                value={type}
                checked={filters.jobType === type}
                onChange={(e) => handleFieldChange('jobType', e.target.value)}
                className="text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-slate-400" />
          Experience Level
        </label>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-indigo-600">
            <input
              type="radio"
              name="experience"
              checked={!filters.experience}
              onChange={() => handleFieldChange('experience', '')}
              className="text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
            />
            <span>All Experience Levels</span>
          </label>
          {experienceLevels.map((exp) => (
            <label
              key={exp}
              className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-indigo-600"
            >
              <input
                type="radio"
                name="experience"
                value={exp}
                checked={filters.experience === exp}
                onChange={(e) => handleFieldChange('experience', e.target.value)}
                className="text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
              />
              <span>{exp}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Minimum Salary */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <IndianRupeeIcon className="w-3.5 h-3.5 text-slate-400" />
          Target Annual Compensation
        </label>
        <select
          id="filter-salary-select"
          value={filters.salary || ''}
          onChange={(e) => handleFieldChange('salary', e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {salaryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Remote Quick Filter */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer py-1">
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Only Remote Roles
          </span>
          <input
            id="filter-remote-checkbox"
            type="checkbox"
            checked={filters.location === 'Remote'}
            onChange={(e) => handleFieldChange('location', e.target.checked ? 'Remote' : '')}
            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};

export default FilterPanel;
