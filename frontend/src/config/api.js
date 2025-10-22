// API Configuration
// In production, the frontend is served from the same domain as the backend
// In development, we use localhost:5000

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');

export { API_BASE_URL };
