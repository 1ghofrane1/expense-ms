/**
 * Home Page Component
 * 
 * Main page that displays dashboard, expense list, and form
 */

import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import FilterBar from '../components/FilterBar';
import * as expenseService from '../services/expenseService';
import './Home.css';

function Home() {
  // State management
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [editingExpense, setEditingExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch expenses on component mount and when filters change
  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  /**
   * Fetch expenses from API
   */
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseService.getExpenses(filters);
      setExpenses(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle filter changes
   */
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  /**
   * Handle creating a new expense
   */
  const handleCreateExpense = async (expenseData) => {
    try {
      await expenseService.createExpense(expenseData);
      await fetchExpenses(); // Refresh list
      setShowForm(false);
      setError(null);
    } catch (err) {
      throw err; // Let form handle the error
    }
  };

  /**
   * Handle updating an expense
   */
  const handleUpdateExpense = async (id, expenseData) => {
    try {
      await expenseService.updateExpense(id, expenseData);
      await fetchExpenses(); // Refresh list
      setEditingExpense(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      throw err; // Let form handle the error
    }
  };

  /**
   * Handle deleting an expense
   */
  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await expenseService.deleteExpense(id);
      await fetchExpenses(); // Refresh list
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Handle edit button click
   */
  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  /**
   * Handle form cancel
   */
  const handleFormCancel = () => {
    setEditingExpense(null);
    setShowForm(false);
  };

  /**
   * Handle add new expense button
   */
  const handleAddNew = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  return (
    <div className="home-page">
      <div className="container">
        {/* Error message */}
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Dashboard with summary */}
        <Dashboard filters={filters} />

        {/* Filter bar */}
        <div className="section">
          <FilterBar onFilterChange={handleFilterChange} />
        </div>

        {/* Add expense button */}
        <div className="section">
          <button 
            className="btn-primary"
            onClick={handleAddNew}
          >
            ➕ Add New Expense
          </button>
        </div>

        {/* Expense form (shown when adding/editing) */}
        {showForm && (
          <div className="section">
            <div className="card">
              <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
              <ExpenseForm
                expense={editingExpense}
                onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}

        {/* Expense list */}
        <div className="section">
          <ExpenseList
            expenses={expenses}
            loading={loading}
            onEdit={handleEditClick}
            onDelete={handleDeleteExpense}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
