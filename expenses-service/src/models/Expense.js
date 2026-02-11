/**
 * Expense Model
 * 
 * Mongoose schema and model for expenses.
 * Defines the structure, validation rules, and indexes.
 */

const mongoose = require('mongoose');

// Define the expense schema
const expenseSchema = new mongoose.Schema({
  // Title of the expense (required, minimum 2 characters)
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [2, 'Title must be at least 2 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },

  // Amount spent (required, must be positive)
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0'],
    validate: {
      validator: function(value) {
        // Ensure amount has at most 2 decimal places
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      },
      message: 'Amount must have at most 2 decimal places'
    }
  },

  // Category (enum - one of predefined values)
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Food', 'Transport', 'Shopping', 'Bills', 'Other'],
      message: '{VALUE} is not a valid category'
    }
  },

  // Date of the expense (required, stored as Date object)
  date: {
    type: Date,
    required: [true, 'Date is required'],
    // Validate that date is not in the future
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Date cannot be in the future'
    }
  },

  // Optional notes (max 200 characters)
  notes: {
    type: String,
    trim: true,
    maxlength: [200, 'Notes cannot exceed 200 characters'],
    default: ''
  }
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true,
  
  // Customize JSON output
  toJSON: {
    transform: function(doc, ret) {
      // Convert _id to id for cleaner API responses
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      
      // Format date as ISO string for consistency
      if (ret.date) {
        ret.date = ret.date.toISOString().split('T')[0];
      }
      
      return ret;
    }
  }
});

// Indexes for better query performance
expenseSchema.index({ date: -1 }); // Sort by date (descending)
expenseSchema.index({ category: 1 }); // Filter by category
expenseSchema.index({ createdAt: -1 }); // Sort by creation time

// Virtual property example (if needed)
expenseSchema.virtual('formattedAmount').get(function() {
  return `$${this.amount.toFixed(2)}`;
});

// Instance method example: Get expense summary
expenseSchema.methods.getSummary = function() {
  return `${this.title} - ${this.formattedAmount} (${this.category})`;
};

// Static method example: Get expenses by date range
expenseSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).sort({ date: -1 });
};

// Pre-save middleware example (runs before saving)
expenseSchema.pre('save', function(next) {
  // Round amount to 2 decimal places
  if (this.amount) {
    this.amount = Math.round(this.amount * 100) / 100;
  }
  next();
});

// Create and export the model
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
