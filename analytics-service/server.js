/**
 * Analytics Service - Main Server Entry Point
 * 
 * This microservice provides analytics and summary calculations.
 * It does NOT access the database directly - instead it calls
 * the expenses-service via HTTP to get expense data.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const analyticsRoutes = require('./src/routes/analytics');
const errorHandler = require('./src/middleware/errorHandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
// Enable CORS for frontend to make requests
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'analytics-service',
    timestamp: new Date().toISOString(),
    expensesServiceUrl: process.env.EXPENSES_SERVICE_URL
  });
});

// API Routes
app.use('/api', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path
  });
});

// Centralized error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`✅ Analytics Service running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/summary`);
  console.log(`🔗 Expenses Service: ${process.env.EXPENSES_SERVICE_URL}`);
  console.log('='.repeat(50));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
});
