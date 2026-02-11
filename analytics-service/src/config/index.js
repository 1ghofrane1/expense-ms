/**
 * Configuration
 * 
 * Centralized configuration for the analytics service.
 */

module.exports = {
  // Expenses service base URL
  expensesServiceUrl: process.env.EXPENSES_SERVICE_URL || 'http://localhost:3001',
  
  // Valid expense categories
  validCategories: ['Food', 'Transport', 'Shopping', 'Bills', 'Other'],
  
  // HTTP request timeout (in milliseconds)
  requestTimeout: 10000, // 10 seconds
};
