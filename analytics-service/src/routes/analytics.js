/**
 * Analytics Routes
 * 
 * Defines REST API endpoints for analytics:
 * - GET /api/summary - Get expense summary with optional filters
 */

const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analyticsService');

/**
 * GET /api/summary
 * Get summary analytics for expenses
 * 
 * Query params:
 *   - from: Start date (YYYY-MM-DD) - optional
 *   - to: End date (YYYY-MM-DD) - optional
 * 
 * Returns:
 *   {
 *     totalAmount: number,
 *     count: number,
 *     byCategory: [
 *       { category: string, total: number, count: number }
 *     ]
 *   }
 */
router.get('/summary', async (req, res, next) => {
  try {
    const { from, to, category } = req.query;
    
    // Build filters object
    const filters = {};
    
    if (from) {
      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) {
        return res.status(400).json({
          error: 'Invalid from date format. Use YYYY-MM-DD'
        });
      }
      filters.from = from;
    }
    
    if (to) {
      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(to)) {
        return res.status(400).json({
          error: 'Invalid to date format. Use YYYY-MM-DD'
        });
      }
      filters.to = to;
    }
    
    if (category) {
      filters.category = category;
    }
    
    // Validate date range
    if (from && to && new Date(from) > new Date(to)) {
      return res.status(400).json({
        error: 'Start date cannot be after end date'
      });
    }
    
    console.log('📊 Calculating summary with filters:', filters);
    
    // Get summary from analytics service
    const summary = await analyticsService.getSummary(filters);
    
    // Build response
    const response = {
      success: true,
      filters,
      data: summary
    };
    
    res.json(response);
    
  } catch (error) {
    // Pass error to error handler middleware
    next(error);
  }
});

/**
 * GET /api/category-trend/:category
 * Get trend for a specific category (example endpoint)
 * 
 * This is an example of how you could extend the analytics service
 * with more complex analytics endpoints
 */
router.get('/category-trend/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const { from1, to1, from2, to2 } = req.query;
    
    // Validate required params
    if (!from1 || !to1 || !from2 || !to2) {
      return res.status(400).json({
        error: 'Required query params: from1, to1, from2, to2 (all in YYYY-MM-DD format)'
      });
    }
    
    // Get trend data
    const trend = await analyticsService.getCategoryTrend(
      category,
      from1,
      to1,
      from2,
      to2
    );
    
    res.json({
      success: true,
      data: trend
    });
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;
