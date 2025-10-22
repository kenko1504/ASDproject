import { API_BASE_URL } from '../config/api.js';

import axios from 'axios';
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

// API utility functions to create the headers with token and make requests
export const getAPI = async (endpoint, token) => { // GET API
    try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error caused from GET Request: ' + error);
        throw error;
    }
};

export const postAPI = async (endpoint, data, token) => { // POST API
    try {
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error caused from POST Request: ' + error);
        throw error;
    }
};

export const putAPI = async (endpoint, data, token) => { // PUT API
    try {
        const response = await axios.put(`${API_BASE_URL}${endpoint}`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error caused from PUT Request: ' + error);
        throw error;
    }
};

export const deleteAPI = async (endpoint, token) => { // DELETE API
    try {
        const response = await axios.delete(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return true;
    } catch (error) {
        console.error('Error caused from DELETE Request: ' + error);
        throw error;
    }
};

