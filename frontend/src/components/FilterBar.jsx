/**
 * Filter Bar Component
 * 
 * Allows users to filter expenses by date range and category
 */

import { useState } from 'react';
import { formatDateForInput } from '../utils/formatters';
import './FilterBar.css';

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Other'];

function FilterBar({ onFilterChange }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [category, setCategory] = useState('All');

  /**
   * Handle filter application
   */
  const handleApplyFilters = () => {
    const filters = {};
    
    if (fromDate) filters.from = fromDate;
    if (toDate) filters.to = toDate;
    if (category && category !== 'All') filters.category = category;
    
    onFilterChange(filters);
  };

  /**
   * Handle filter reset
   */
  const handleReset = () => {
    setFromDate('');
    setToDate('');
    setCategory('All');
    onFilterChange({});
  };

  /**
   * Quick date filters
   */
  const handleQuickFilter = (type) => {
    const today = new Date();
    let from = new Date();
    
    switch (type) {
      case 'today':
        from = today;
        break;
      case 'week':
        from.setDate(today.getDate() - 7);
        break;
      case 'month':
        from.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        from.setFullYear(today.getFullYear() - 1);
        break;
      default:
        from = null;
    }
    
    if (from) {
      setFromDate(formatDateForInput(from));
      setToDate(formatDateForInput(today));
    }
  };

  return (
    <div className="filter-bar card">
      <h3>🔍 Filters</h3>
      
      <div className="filter-grid">
        {/* Date range */}
        <div className="filter-group">
          <label>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            max={toDate || formatDateForInput(new Date())}
          />
        </div>

        <div className="filter-group">
          <label>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate}
            max={formatDateForInput(new Date())}
          />
        </div>

        {/* Category filter */}
        <div className="filter-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick filters */}
      <div className="quick-filters">
        <span className="quick-filters-label">Quick:</span>
        <button 
          className="btn-sm btn-secondary"
          onClick={() => handleQuickFilter('today')}
        >
          Today
        </button>
        <button 
          className="btn-sm btn-secondary"
          onClick={() => handleQuickFilter('week')}
        >
          Last 7 Days
        </button>
        <button 
          className="btn-sm btn-secondary"
          onClick={() => handleQuickFilter('month')}
        >
          Last Month
        </button>
        <button 
          className="btn-sm btn-secondary"
          onClick={() => handleQuickFilter('year')}
        >
          Last Year
        </button>
      </div>

      {/* Action buttons */}
      <div className="filter-actions">
        <button 
          className="btn-primary"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </button>
        <button 
          className="btn-secondary"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
