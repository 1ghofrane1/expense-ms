/**
 * Expense List Component
 * 
 * Displays list of expenses in a table with sorting
 */

import { useState } from 'react';
import { formatCurrency, formatDate, getCategoryColor, getCategoryIcon } from '../utils/formatters';
import './ExpenseList.css';

function ExpenseList({ expenses, loading, onEdit, onDelete }) {
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  /**
   * Handle sorting
   */
  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle order if clicking same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field - default to descending
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  /**
   * Get sorted expenses
   */
  const getSortedExpenses = () => {
    if (!expenses || expenses.length === 0) return [];

    const sorted = [...expenses].sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'date':
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          break;
        case 'amount':
          aVal = a.amount;
          bVal = b.amount;
          break;
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'category':
          aVal = a.category;
          bVal = b.category;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  /**
   * Render sort indicator
   */
  const SortIndicator = ({ field }) => {
    if (sortBy !== field) return null;
    return <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  const sortedExpenses = getSortedExpenses();

  return (
    <div className="expense-list">
      <div className="list-header">
        <h2>📝 Expenses</h2>
        <div className="list-info">
          {!loading && (
            <span className="expense-count">
              {sortedExpenses.length} {sortedExpenses.length === 1 ? 'expense' : 'expenses'}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : sortedExpenses.length === 0 ? (
        <div className="empty-state card">
          <p className="text-muted">No expenses found. Add your first expense to get started!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="expense-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('date')} className="sortable">
                  Date <SortIndicator field="date" />
                </th>
                <th onClick={() => handleSort('title')} className="sortable">
                  Title <SortIndicator field="title" />
                </th>
                <th onClick={() => handleSort('category')} className="sortable">
                  Category <SortIndicator field="category" />
                </th>
                <th onClick={() => handleSort('amount')} className="sortable amount-col">
                  Amount <SortIndicator field="amount" />
                </th>
                <th>Notes</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="date-col">{formatDate(expense.date)}</td>
                  <td className="title-col">{expense.title}</td>
                  <td>
                    <span 
                      className="category-badge"
                      style={{ 
                        backgroundColor: getCategoryColor(expense.category) + '20',
                        color: getCategoryColor(expense.category)
                      }}
                    >
                      <span className="category-icon-sm">{getCategoryIcon(expense.category)}</span>
                      {expense.category}
                    </span>
                  </td>
                  <td className="amount-col">{formatCurrency(expense.amount)}</td>
                  <td className="notes-col">
                    {expense.notes ? (
                      <span className="text-muted text-sm">{expense.notes}</span>
                    ) : (
                      <span className="text-muted text-sm">—</span>
                    )}
                  </td>
                  <td className="actions-col">
                    <div className="action-buttons">
                      <button
                        className="btn-sm btn-secondary"
                        onClick={() => onEdit(expense)}
                        title="Edit expense"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-sm btn-danger"
                        onClick={() => onDelete(expense.id)}
                        title="Delete expense"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
