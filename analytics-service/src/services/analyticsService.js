/**
 * Analytics Service
 * 
 * Business logic for analytics calculations.
 * This service calls the expenses-service to get expense data
 * and computes summaries without accessing the database directly.
 */

const axios = require('axios');
const config = require('../config');

/**
 * Get summary analytics for expenses
 * 
 * @param {Object} filters - Optional filters (from, to dates)
 * @returns {Object} Summary data with totalAmount, count, and byCategory breakdown
 */
const getSummary = async (filters = {}) => {
  try {
    // Build URL for expenses-service
    const baseUrl = `${config.expensesServiceUrl}/api/expenses`;
    const params = new URLSearchParams();
    
    // Add optional filters
    if (filters.from) {
      params.append('from', filters.from);
    }
    
    if (filters.to) {
      params.append('to', filters.to);
    }
    
    if (filters.category) {
      params.append('category', filters.category);
    }
    
    const url = `${baseUrl}?${params.toString()}`;
    
    console.log(`📞 Calling expenses-service: ${url}`);
    
    // Call expenses-service via HTTP
    const response = await axios.get(url, {
      timeout: config.requestTimeout
    });
    
    // Get expenses data from response
    const expenses = response.data.data || [];
    
    console.log(`✅ Retrieved ${expenses.length} expenses from expenses-service`);
    
    // Calculate summary statistics
    const summary = calculateSummary(expenses);
    
    return summary;
    
  } catch (error) {
    // Handle errors from expenses-service
    console.error('❌ Error calling expenses-service:', error.message);
    
    if (error.response) {
      // The expenses-service responded with an error status
      throw new Error(`Expenses service error: ${error.response.data.error || error.response.statusText}`);
    } else if (error.request) {
      // No response received from expenses-service
      throw new Error('Expenses service is not responding. Please ensure it is running on ' + config.expensesServiceUrl);
    } else {
      // Error setting up the request
      throw error;
    }
  }
};

/**
 * Calculate summary statistics from expenses array
 * 
 * @param {Array} expenses - Array of expense objects
 * @returns {Object} Summary with totalAmount, count, and byCategory breakdown
 */
const calculateSummary = (expenses) => {
  // Initialize summary object
  const summary = {
    totalAmount: 0,
    count: expenses.length,
    byCategory: []
  };
  
  // If no expenses, return empty summary
  if (expenses.length === 0) {
    // Initialize empty categories
    config.validCategories.forEach(category => {
      summary.byCategory.push({
        category,
        total: 0,
        count: 0
      });
    });
    
    return summary;
  }
  
  // Group expenses by category and calculate totals
  const categoryMap = {};
  
  expenses.forEach(expense => {
    const category = expense.category;
    const amount = parseFloat(expense.amount);
    
    // Add to total amount
    summary.totalAmount += amount;
    
    // Initialize category if not exists
    if (!categoryMap[category]) {
      categoryMap[category] = {
        category,
        total: 0,
        count: 0
      };
    }
    
    // Add to category totals
    categoryMap[category].total += amount;
    categoryMap[category].count += 1;
  });
  
  // Convert category map to array
  summary.byCategory = Object.values(categoryMap);
  
  // Add categories with zero amounts (if not present)
  config.validCategories.forEach(category => {
    if (!categoryMap[category]) {
      summary.byCategory.push({
        category,
        total: 0,
        count: 0
      });
    }
  });
  
  // Sort by total amount (descending)
  summary.byCategory.sort((a, b) => b.total - a.total);
  
  // Round total amount to 2 decimal places
  summary.totalAmount = Math.round(summary.totalAmount * 100) / 100;
  
  // Round category totals to 2 decimal places
  summary.byCategory.forEach(cat => {
    cat.total = Math.round(cat.total * 100) / 100;
  });
  
  return summary;
};

/**
 * Get category trend (comparing two date ranges)
 * This is an example of another analytics function you could implement
 */
const getCategoryTrend = async (category, fromDate1, toDate1, fromDate2, toDate2) => {
  try {
    // Get expenses for both periods
    const [period1, period2] = await Promise.all([
      getSummary({ from: fromDate1, to: toDate1, category }),
      getSummary({ from: fromDate2, to: toDate2, category })
    ]);
    
    // Calculate trend
    const categoryData1 = period1.byCategory.find(c => c.category === category);
    const categoryData2 = period2.byCategory.find(c => c.category === category);
    
    const total1 = categoryData1 ? categoryData1.total : 0;
    const total2 = categoryData2 ? categoryData2.total : 0;
    
    const change = total2 - total1;
    const percentChange = total1 > 0 ? ((change / total1) * 100).toFixed(2) : 0;
    
    return {
      category,
      period1: { from: fromDate1, to: toDate1, total: total1 },
      period2: { from: fromDate2, to: toDate2, total: total2 },
      change,
      percentChange
    };
    
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getSummary,
  getCategoryTrend
};
