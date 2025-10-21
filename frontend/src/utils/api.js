import { API_BASE_URL } from '../config/api.js';

// Utility function to get authorization headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  } : {
    'Content-Type': 'application/json'
  };
};

// Wrapper for fetch with automatic token inclusion
export const authenticatedFetch = (url, options = {}) => {
  const authHeaders = getAuthHeaders();

  return fetch(url, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers
    }
  });
};

// Export API_BASE_URL for use in components
export { API_BASE_URL };