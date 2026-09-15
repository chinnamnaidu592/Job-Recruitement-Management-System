import React, { createContext, useContext, useState, useEffect } from 'react';
import * as savedJobsApi from '../api/savedJobsApi';

const SavedJobsContext = createContext(null);

const STORAGE_KEY = 'workpulse_saved_jobs';

export const SavedJobsProvider = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  // Sync with API on mount
  useEffect(() => {
    let isMounted = true;
    const loadSavedJobs = async () => {
      try {
        const remoteSaved = await savedJobsApi.getSavedJobs();
        if (isMounted && Array.isArray(remoteSaved) && remoteSaved.length > 0) {
          setSavedJobs(remoteSaved);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteSaved));
        }
      } catch (err) {
        console.warn('Could not sync saved jobs from API, using local storage cache:', err.message);
      }
    };
    loadSavedJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Check if a job is saved
  const isSaved = (jobId) => {
    return savedJobs.some((j) => String(j.id) === String(jobId));
  };

  // Save a job
  const saveJob = async (job) => {
    if (!job || isSaved(job.id)) return;
    const updated = [job, ...savedJobs];
    setSavedJobs(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      await savedJobsApi.saveJob(job);
    } catch (err) {
      console.warn('Saved job locally, API update failed:', err.message);
    }
  };

  // Remove a job from saved
  const removeJob = async (jobId) => {
    const updated = savedJobs.filter((j) => String(j.id) !== String(jobId));
    setSavedJobs(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      await savedJobsApi.removeSavedJob(jobId);
    } catch (err) {
      console.warn('Removed job locally, API update failed:', err.message);
    }
  };

  // Toggle saved state
  const toggleSaveJob = async (job) => {
    if (!job) return;
    if (isSaved(job.id)) {
      await removeJob(job.id);
    } else {
      await saveJob(job);
    }
  };

  return (
    <SavedJobsContext.Provider
      value={{
        savedJobs,
        saveJob,
        removeJob,
        toggleSaveJob,
        isSaved,
      }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error('useSavedJobs must be used within a SavedJobsProvider');
  }
  return context;
};

export default SavedJobsContext;
