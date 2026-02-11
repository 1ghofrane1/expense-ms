/**
 * Expenses Routes
 * 
 * Defines all REST API endpoints for expense operations:
 * - GET /api/expenses - Get all expenses (with optional filters)
 * - GET /api/expenses/:id - Get single expense
 * - POST /api/expenses - Create new expense
 * - PUT /api/expenses/:id - Update expense
 * - DELETE /api/expenses/:id - Delete expense
 */

const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { 
  validateExpenseCreation, 
  validateExpenseUpdate, 
  handleValidationErrors 
} = require('../middleware/validator');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

/**
 * GET /api/expenses
 * Get all expenses with optional filters
 * Query params:
 *   - from: Start date (YYYY-MM-DD)
 *   - to: End date (YYYY-MM-DD)
 *   - category: Category filter (Food, Transport, etc.)
 */
router.get('/', asyncHandler(async (req, res) => {
  const { from, to, category } = req.query;
  
  // Build query filter
  const filter = {};
  
  // Date range filter
  if (from || to) {
    filter.date = {};
    
    if (from) {
      filter.date.$gte = new Date(from);
    }
    
    if (to) {
      // Set to end of day
      const endDate = new Date(to);
      endDate.setHours(23, 59, 59, 999);
      filter.date.$lte = endDate;
    }
  }
  
  // Category filter
  if (category) {
    // Validate category value
    const validCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];
    if (!validCategories.includes(category)) {
      throw new AppError('Invalid category filter', 400);
    }
    filter.category = category;
  }
  
  // Execute query with filters and sort by date (newest first)
  const expenses = await Expense.find(filter)
    .sort({ date: -1, createdAt: -1 });
  
  res.json({
    success: true,
    count: expenses.length,
    data: expenses
  });
}));

/**
 * GET /api/expenses/:id
 * Get a single expense by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Find expense by ID
  const expense = await Expense.findById(id);
  
  // Check if expense exists
  if (!expense) {
    throw new AppError('Expense not found', 404);
  }
  
  res.json({
    success: true,
    data: expense
  });
}));

/**
 * POST /api/expenses
 * Create a new expense
 * Body: { title, amount, category, date, notes? }
 */
router.post('/', 
  validateExpenseCreation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { title, amount, category, date, notes } = req.body;
    
    // Create new expense
    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      notes: notes || ''
    });
    
    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense
    });
  })
);

/**
 * PUT /api/expenses/:id
 * Update an existing expense
 * Body: Any of { title, amount, category, date, notes }
 */
router.put('/:id',
  validateExpenseUpdate,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    // Check if there are any updates
    if (Object.keys(updates).length === 0) {
      throw new AppError('No update data provided', 400);
    }
    
    // Find and update expense
    // { new: true } returns the updated document
    // { runValidators: true } runs model validators on update
    const expense = await Expense.findByIdAndUpdate(
      id,
      updates,
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    // Check if expense exists
    if (!expense) {
      throw new AppError('Expense not found', 404);
    }
    
    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  })
);

/**
 * DELETE /api/expenses/:id
 * Delete an expense
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Find and delete expense
  const expense = await Expense.findByIdAndDelete(id);
  
  // Check if expense exists
  if (!expense) {
    throw new AppError('Expense not found', 404);
  }
  
  res.json({
    success: true,
    message: 'Expense deleted successfully',
    data: expense
  });
}));

module.exports = router;
