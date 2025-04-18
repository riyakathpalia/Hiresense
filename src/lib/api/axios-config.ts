// src/services/api/axiosConfig.js
import axios from 'axios';

// Create axios instance with default config
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://43.205.240.35:8501/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle different error scenarios

    // Add log to see the original error structure
    console.error('Raw Axios Error:', error); 

    const customError = {
      message: error.response?.data?.error || error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      data: error.response?.data || {},
    };
    
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', customError);
    }
    
    // Handle specific error codes
    switch (customError.status) {
      case 401:
        // Handle unauthorized
        // Could redirect to login or clear tokens
        break;
      case 404:
        // Handle not found
        break;
      default:
        console.log('');
        break;
    }
    
    return Promise.reject(customError);
  }
);

export default API;