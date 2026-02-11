/**
 * Centralized Error Handler Middleware
 * 
 * Handles all errors that occur in the analytics service.
 */

const errorHandler = (err, req, res, next) => {
  // Log the error
  console.error('❌ Error occurred:');
  console.error('Path:', req.path);
  console.error('Method:', req.method);
  console.error('Error:', err.message);
  
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack:', err.stack);
  }
  
  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  
  // Handle specific error types
  
  // Axios errors (from calling expenses-service)
  if (err.isAxiosError) {
    if (err.response) {
      // Expenses service returned an error
      statusCode = err.response.status;
      message = `Expenses service error: ${err.response.data.error || err.response.statusText}`;
    } else if (err.code === 'ECONNREFUSED') {
      statusCode = 503;
      message = 'Expenses service is not available. Please ensure it is running.';
    } else if (err.code === 'ETIMEDOUT') {
      statusCode = 504;
      message = 'Request to expenses service timed out';
    }
  }
  
  // Build error response
  const errorResponse = {
    error: message,
    statusCode,
    timestamp: new Date().toISOString()
  };
  
  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
