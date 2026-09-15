import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * CategoryCard component
 * @param {string} name - Category name
 * @param {React.ReactNode} icon - Icon component
 * @param {number|string} count - Available job count
 */
export const CategoryCard = ({ name, icon, count, className = '' }) => {
  const encodedCategory = encodeURIComponent(name);

  return (
    <Link
      to={`/jobs?category=${encodedCategory}`}
      id={`category-card-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
      className={`group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all duration-200 flex flex-col justify-between cursor-pointer ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          {icon}
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
          {count} {count === 1 ? 'Job' : 'Jobs'}
        </span>
      </div>

      <div>
        <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-1">
          {name}
        </h3>
        <div className="flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-indigo-600 transition-colors">
          <span>Explore listings</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
