import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home as HomeIcon, Search } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center py-16">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-xs">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
        Error 404
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
        Page Not Found
      </h1>

      <p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base mb-8 leading-relaxed">
        The destination you are looking for does not exist or has been relocated within the Job Portal.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/">
          <Button variant="primary" size="md" leftIcon={<HomeIcon className="w-4 h-4" />}>
            Return Home
          </Button>
        </Link>
        <Link to="/jobs">
          <Button variant="outline" size="md" leftIcon={<Search className="w-4 h-4" />}>
            Browse Open Jobs
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
