/**
 * Validation Middleware
 * 
 * Uses express-validator to validate request data.
 * Defines validation rules for creating and updating expenses.
 */

const { body, validationResult } = require('express-validator');

/**
 * Validation rules for creating an expense
 */
const validateExpenseCreation = [
  // Title validation
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 2, max: 100 }).withMessage('Title must be between 2 and 100 characters'),

  // Amount validation
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0')
    .custom((value) => {
      // Check for max 2 decimal places
      const decimals = (value.toString().split('.')[1] || '').length;
      if (decimals > 2) {
        throw new Error('Amount can have at most 2 decimal places');
      }
      return true;
    }),

  // Category validation
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Food', 'Transport', 'Shopping', 'Bills', 'Other'])
    .withMessage('Category must be one of: Food, Transport, Shopping, Bills, Other'),

  // Date validation
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be in valid ISO format (YYYY-MM-DD)')
    .custom((value) => {
      // Check that date is not in the future
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      
      if (inputDate > today) {
        throw new Error('Date cannot be in the future');
      }
      return true;
    }),

  // Notes validation (optional)
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Notes cannot exceed 200 characters')
];

/**
 * Validation rules for updating an expense
 * All fields are optional since it's a partial update
 */
const validateExpenseUpdate = [
  // Title validation (optional)
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Title must be between 2 and 100 characters'),

  // Amount validation (optional)
  body('amount')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0')
    .custom((value) => {
      const decimals = (value.toString().split('.')[1] || '').length;
      if (decimals > 2) {
        throw new Error('Amount can have at most 2 decimal places');
      }
      return true;
    }),

  // Category validation (optional)
  body('category')
    .optional()
    .isIn(['Food', 'Transport', 'Shopping', 'Bills', 'Other'])
    .withMessage('Category must be one of: Food, Transport, Shopping, Bills, Other'),

  // Date validation (optional)
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be in valid ISO format (YYYY-MM-DD)')
    .custom((value) => {
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (inputDate > today) {
        throw new Error('Date cannot be in the future');
      }
      return true;
    }),

  // Notes validation (optional)
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Notes cannot exceed 200 characters')
];

/**
 * Middleware to check validation results
 * If there are validation errors, return 400 with error details
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

module.exports = {
  validateExpenseCreation,
  validateExpenseUpdate,
  handleValidationErrors
};
