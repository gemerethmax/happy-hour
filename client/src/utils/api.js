// API base URL - update this when deploying to Render
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    // API returned an error
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API calls
export const authAPI = {
  signup: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important: Include cookies
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return handleResponse(response);
  },

  verify: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },
};

// Happy Hours API calls
export const happyHoursAPI = {
  getAll: async (filters = {}) => {
    // Build query string from filters object
    const params = new URLSearchParams();
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.day !== undefined) params.append('day', filters.day);
    if (filters.date) params.append('date', filters.date);

    const queryString = params.toString();
    const url = `${API_BASE_URL}/happy-hours${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      credentials: 'include',
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/happy-hours/${id}`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },
};

// Interests API calls
export const interestsAPI = {
  save: async (happyHourId) => {
    const response = await fetch(`${API_BASE_URL}/interests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ happy_hour_id: happyHourId }),
    });
    return handleResponse(response);
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/interests`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },

  delete: async (interestId) => {
    const response = await fetch(`${API_BASE_URL}/interests/${interestId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse(response);
  },
};
