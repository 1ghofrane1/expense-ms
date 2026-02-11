/**
 * Utility Functions for Formatting
 */

/**
 * Format number as currency (USD)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format date as readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "Jan 15, 2024")
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

/**
 * Format date for input field (YYYY-MM-DD)
 * @param {Date} date - Date object
 * @returns {string} Formatted date for input
 */
export const formatDateForInput = (date) => {
  if (!date) {
    date = new Date();
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Get category color for visual distinction
 * @param {string} category - Expense category
 * @returns {string} Color code
 */
export const getCategoryColor = (category) => {
  const colors = {
    Food: '#10b981',       // Green
    Transport: '#3b82f6',  // Blue
    Shopping: '#f59e0b',   // Orange
    Bills: '#ef4444',      // Red
    Other: '#8b5cf6'       // Purple
  };
  
  return colors[category] || '#6b7280';
};

/**
 * Get emoji icon for category
 * @param {string} category - Expense category
 * @returns {string} Emoji
 */
export const getCategoryIcon = (category) => {
  const icons = {
    Food: '🍔',
    Transport: '🚗',
    Shopping: '🛍️',
    Bills: '📄',
    Other: '💡'
  };
  
  return icons[category] || '💰';
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength) + '...';
};
