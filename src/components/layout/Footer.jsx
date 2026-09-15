import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, ExternalLink, Shield, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          {/* Architecture & Tech Specs */}
          <div className="md:col-span-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Technical Stack
              </h4>
              <p className="text-xs text-slate-400">
                React, Axios, React Router, React Hook Form, JSON Server
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[11px] text-slate-300">
                  React 19
                </span>
                <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[11px] text-slate-300">
                  Tailwind CSS
                </span>
                <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[11px] text-slate-300">
                  Axios Client
                </span>
                <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[11px] text-slate-300">
                  JSON Server
                </span>
                <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[11px] text-slate-300">
                  Context API
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} LCN Recruitment Portal. Randi Job Kottandi</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Edho saradaki chesam pends.
            </span>
            <span className="flex items-center gap-1">
              Quality etla undhi.
            </span>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          <strong className="font-semibold text-slate-400">Disclaimer:</strong> This website is developed solely for educational and learning purposes. Content featured in regional languages is intended purely for entertainment.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
