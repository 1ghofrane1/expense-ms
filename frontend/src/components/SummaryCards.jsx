/**
 * Summary Cards Component
 * 
 * Displays summary statistics in card format
 */

import { formatCurrency, getCategoryColor, getCategoryIcon } from '../utils/formatters';
import './SummaryCards.css';

function SummaryCards({ summary }) {
  const { totalAmount, count, byCategory } = summary;

  return (
    <div className="summary-cards">
      {/* Total amount card */}
      <div className="summary-card total-card">
        <div className="summary-icon">💰</div>
        <div className="summary-content">
          <div className="summary-label">Total Spent</div>
          <div className="summary-value">{formatCurrency(totalAmount)}</div>
        </div>
      </div>

      {/* Total count card */}
      <div className="summary-card count-card">
        <div className="summary-icon">📝</div>
        <div className="summary-content">
          <div className="summary-label">Total Expenses</div>
          <div className="summary-value">{count}</div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="category-breakdown">
        <h3>By Category</h3>
        <div className="category-grid">
          {byCategory.map((cat) => (
            <div 
              key={cat.category} 
              className="category-card"
              style={{ borderLeftColor: getCategoryColor(cat.category) }}
            >
              <div className="category-header">
                <span className="category-icon">{getCategoryIcon(cat.category)}</span>
                <span className="category-name">{cat.category}</span>
              </div>
              <div className="category-stats">
                <div className="category-amount">{formatCurrency(cat.total)}</div>
                <div className="category-count">{cat.count} {cat.count === 1 ? 'expense' : 'expenses'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;
