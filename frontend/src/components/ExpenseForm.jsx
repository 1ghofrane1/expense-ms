/**
 * Expense Form Component
 * 
 * Form for creating and editing expenses
 */

import { useState, useEffect } from 'react';
import { formatDateForInput } from '../utils/formatters';
import './ExpenseForm.css';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];

function ExpenseForm({ expense, onSubmit, onCancel }) {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: formatDateForInput(new Date()),
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Populate form when editing
  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        amount: expense.amount || '',
        category: expense.category || 'Food',
        date: expense.date || formatDateForInput(new Date()),
        notes: expense.notes || ''
      });
    }
  }, [expense]);

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate amount
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Amount must be a positive number');
      }

      // Prepare submission data
      const submitData = {
        ...formData,
        amount: amount
      };

      // Call parent submit handler
      if (expense) {
        await onSubmit(expense.id, submitData);
      } else {
        await onSubmit(submitData);
      }

      // Reset form if creating new expense
      if (!expense) {
        setFormData({
          title: '',
          amount: '',
          category: 'Food',
          date: formatDateForInput(new Date()),
          notes: ''
        });
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="form-grid">
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={100}
            placeholder="e.g., Grocery shopping"
            disabled={loading}
          />
        </div>

        {/* Amount */}
        <div className="form-group">
          <label htmlFor="amount">Amount ($) *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
            placeholder="0.00"
            disabled={loading}
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            disabled={loading}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            max={formatDateForInput(new Date())}
            disabled={loading}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="form-group">
        <label htmlFor="notes">Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          maxLength={200}
          rows={3}
          placeholder="Add any additional notes..."
          disabled={loading}
        />
        <small className="text-muted">
          {formData.notes.length}/200 characters
        </small>
      </div>

      {/* Form actions */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : expense ? 'Update Expense' : 'Add Expense'}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ExpenseForm;
