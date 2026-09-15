import axiosClient from './axiosClient';

/**
 * Fetch all saved jobs from API
 * @returns {Promise<Array>}
 */
export const getSavedJobs = async () => {
  try {
    return await axiosClient.get('/savedJobs');
  } catch {
    // If savedJobs endpoint is empty or missing, fallback to local storage
    const local = localStorage.getItem('saved_jobs');
    return local ? JSON.parse(local) : [];
  }
};

/**
 * Save a job
 * @param {Object} job
 * @returns {Promise<Object>}
 */
export const saveJob = async (job) => {
  try {
    return await axiosClient.post('/savedJobs', job);
  } catch {
    const local = localStorage.getItem('saved_jobs');
    const list = local ? JSON.parse(local) : [];
    if (!list.some((j) => String(j.id) === String(job.id))) {
      list.push(job);
      localStorage.setItem('saved_jobs', JSON.stringify(list));
    }
    return job;
  }
};

/**
 * Remove a saved job by ID
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export const removeSavedJob = async (id) => {
  try {
    return await axiosClient.delete(`/savedJobs/${id}`);
  } catch {
    const local = localStorage.getItem('saved_jobs');
    let list = local ? JSON.parse(local) : [];
    list = list.filter((j) => String(j.id) !== String(id));
    localStorage.setItem('saved_jobs', JSON.stringify(list));
    return { success: true };
  }
};
