/**
 * Analytics Service API Client
 * 
 * All HTTP requests to the analytics-service microservice
 */

import axios from 'axios';

// Base URL from environment variables
const BASE_URL = import.meta.env.VITE_ANALYTICS_API_URL || 'http://localhost:3002/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Analytics might take longer
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Get expense summary with optional filters
 * @param {Object} filters - Optional filters (from, to)
 * @returns {Promise<Object>} Summary data
 */
export const getSummary = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    
    const response = await api.get(`/summary?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching summary:', error);
    throw handleError(error);
  }
};

/**
 * Handle API errors consistently
 * @param {Error} error - Axios error object
 * @returns {Error} Formatted error
 */
const handleError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data.error || 
                    error.response.data.message || 
                    'An error occurred';
    
    const err = new Error(message);
    err.status = error.response.status;
    return err;
    
  } else if (error.request) {
    // Request made but no response received
    return new Error('Unable to connect to analytics service. Please check if it is running.');
    
  } else {
    // Error setting up request
    return new Error(error.message || 'An unexpected error occurred');
  }
};

export default {
  getSummary
};
