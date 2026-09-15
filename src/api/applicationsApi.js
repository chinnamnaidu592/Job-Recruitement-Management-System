import axiosClient from './axiosClient';

/**
 * Fetch all submitted applications
 * @returns {Promise<Array>}
 */
export const getApplications = async () => {
  return axiosClient.get('/applications');
};

/**
 * Submit a new job application
 * @param {Object} data - Application form payload
 * @returns {Promise<Object>}
 */
export const createApplication = async (data) => {
  const payload = {
    ...data,
    appliedDate: data.appliedDate || new Date().toISOString().split('T')[0],
    status: data.status || 'Applied',
  };
  return axiosClient.post('/applications', payload);
};

/**
 * Update candidate application status (e.g. Applied, Under Review, Shortlisted, Rejected)
 * @param {string|number} id - Application ID
 * @param {string} status - New status
 * @returns {Promise<Object>}
 */
export const updateApplicationStatus = async (id, status) => {
  return axiosClient.patch(`/applications/${id}`, { status });
};

/**
 * Delete a rejected application
 * @param {string|number} id - Application ID
 * @returns {Promise<Object>}
 */
export const deleteApplication = async (id) => {
  return axiosClient.delete(`/applications/${id}`);
};
