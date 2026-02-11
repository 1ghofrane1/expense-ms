/**
 * Expense Service API Client
 * 
 * All HTTP requests to the expenses-service microservice
 */

import axios from 'axios';

// Base URL from environment variables
const BASE_URL = import.meta.env.VITE_EXPENSES_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Get all expenses with optional filters
 * @param {Object} filters - Optional filters (from, to, category)
 * @returns {Promise<Array>} Array of expenses
 */
export const getExpenses = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    if (filters.category) params.append('category', filters.category);
    
    const response = await api.get(`/expenses?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw handleError(error);
  }
};

/**
 * Get single expense by ID
 * @param {string} id - Expense ID
 * @returns {Promise<Object>} Expense object
 */
export const getExpenseById = async (id) => {
  try {
    const response = await api.get(`/expenses/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching expense:', error);
    throw handleError(error);
  }
};

/**
 * Create new expense
 * @param {Object} expenseData - Expense data
 * @returns {Promise<Object>} Created expense
 */
export const createExpense = async (expenseData) => {
  try {
    const response = await api.post('/expenses', expenseData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw handleError(error);
  }
};

/**
 * Update existing expense
 * @param {string} id - Expense ID
 * @param {Object} expenseData - Updated expense data
 * @returns {Promise<Object>} Updated expense
 */
export const updateExpense = async (id, expenseData) => {
  try {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw handleError(error);
  }
};

/**
 * Delete expense
 * @param {string} id - Expense ID
 * @returns {Promise<Object>} Deleted expense
 */
export const deleteExpense = async (id) => {
  try {
    const response = await api.delete(`/expenses/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error deleting expense:', error);
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
    
    const details = error.response.data.details;
    
    const err = new Error(message);
    err.details = details;
    err.status = error.response.status;
    return err;
    
  } else if (error.request) {
    // Request made but no response received
    return new Error('Unable to connect to server. Please check if the expenses service is running.');
    
  } else {
    // Error setting up request
    return new Error(error.message || 'An unexpected error occurred');
  }
};

export default {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
};
