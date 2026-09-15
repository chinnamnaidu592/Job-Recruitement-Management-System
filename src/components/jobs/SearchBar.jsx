import React, { useState, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import Button from '../common/Button';

/**
 * SearchBar component
 * @param {string} initialSearch - initial search keyword
 * @param {string} initialLocation - initial location keyword
 * @param {Function} onSearch - callback receiving { search, location }
 * @param {string} placeholder
 */
export const SearchBar = ({
  initialSearch = '',
  initialLocation = '',
  onSearch,
  placeholder = 'Job title, keyword, or company...',
  className = '',
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ search: search.trim(), location: location.trim() });
    }
  };

  const handleClear = () => {
    setSearch('');
    setLocation('');
    if (onSearch) {
      onSearch({ search: '', location: '' });
    }
  };

  const hasValues = Boolean(search || location);

  return (
    <form
      id="jobs-search-form"
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-2 sm:p-2.5 flex flex-col md:flex-row items-stretch gap-2 ${className}`}
    >
      {/* Title / Keyword Input */}
      <div className="flex-1 relative flex items-center min-w-0 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-50 md:bg-transparent border md:border-none border-slate-200">
        <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2.5" />
        <input
          id="search-input-title"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
            aria-label="Clear job search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px bg-slate-200 my-1"></div>

      {/* Location Input */}
      <div className="flex-1 relative flex items-center min-w-0 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-50 md:bg-transparent border md:border-none border-slate-200">
        <MapPin className="w-5 h-5 text-slate-400 shrink-0 mr-2.5" />
        <input
          id="search-input-location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, state, or 'Remote'..."
          className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        {location && (
          <button
            type="button"
            onClick={() => setLocation('')}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
            aria-label="Clear location search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-1 md:mt-0">
        {hasValues && (
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleClear}
            className="text-xs text-slate-500"
          >
            Reset
          </Button>
        )}
        <Button
          id="search-submit-button"
          type="submit"
          variant="primary"
          size="md"
          className="w-full md:w-auto px-6 font-semibold"
          leftIcon={<Search className="w-4 h-4" />}
        >
          Find Jobs
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
