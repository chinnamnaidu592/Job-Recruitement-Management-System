import axios from 'axios';

// Get configured base URL from environment or default to http://localhost:5000
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// In cloud/iframe environments where localhost:5000 is not reachable from remote browser,
// automatically use relative base URL which connects directly to the Vite dev server/db.json
const resolveBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const isRemote = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    if (isRemote && configuredBaseUrl.includes('localhost')) {
      return '';
    }
  }
  return configuredBaseUrl;
};

const axiosClient = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error normalization and automatic fallback
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // If connection to localhost fails, retry once using relative path (Vite server mock API)
    if (
      (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) &&
      !originalRequest._retry &&
      originalRequest.baseURL?.includes('localhost')
    ) {
      originalRequest._retry = true;
      originalRequest.baseURL = '';
      try {
        const retryRes = await axios(originalRequest);
        return retryRes.data;
      } catch (retryErr) {
        // fall through to standard error handling
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred. Please check your connection.';

    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
