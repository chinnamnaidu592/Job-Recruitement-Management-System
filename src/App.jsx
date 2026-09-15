import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import JobsListing from './pages/JobsListing';
import JobDetails from './pages/JobDetails';
import ApplyJob from './pages/ApplyJob';
import SavedJobs from './pages/SavedJobs';
import MyApplications from './pages/MyApplications';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { SavedJobsProvider } from './context/SavedJobsContext';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <SavedJobsProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobsListing />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/apply/:id" element={<ApplyJob />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/applications" element={<MyApplications />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </SavedJobsProvider>
  );
}
