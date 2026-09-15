import axiosClient from './axiosClient';

/**
 * Fetch jobs with optional filtering parameters
 * @param {Object} params - search, location, jobType, experience, category, salary
 * @returns {Promise<Array>}
 */
export const getJobs = async (params = {}) => {
  // Clean empty or undefined params
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      cleanParams[key] = params[key];
    }
  });

  return axiosClient.get('/jobs', { params: cleanParams });
};

/**
 * Fetch a single job by its ID
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export const getJobById = async (id) => {
  return axiosClient.get(`/jobs/${id}`);
};
