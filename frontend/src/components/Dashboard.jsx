/**
 * Dashboard Component
 * 
 * Displays summary statistics and analytics
 */

import { useState, useEffect } from 'react';
import SummaryCards from './SummaryCards';
import * as analyticsService from '../services/analyticsService';
import './Dashboard.css';

function Dashboard({ filters }) {
  const analyticsApiUrl = import.meta.env.VITE_ANALYTICS_API_URL || 'http://localhost:3002/api';
  const analyticsBaseUrl = analyticsApiUrl.replace(/\/api\/?$/, '');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch summary when filters change
  useEffect(() => {
    fetchSummary();
  }, [filters]);

  /**
   * Fetch summary from analytics service
   */
  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Only pass date filters to analytics service
      const analyticsFilters = {};
      if (filters.from) analyticsFilters.from = filters.from;
      if (filters.to) analyticsFilters.to = filters.to;
      
      const data = await analyticsService.getSummary(analyticsFilters);
      setSummary(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching summary:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h2>📊 Dashboard</h2>
      
      {error && (
        <div className="error-message">
          <strong>Analytics Error:</strong> {error}
          <br />
          <small>Make sure the analytics service is reachable at {analyticsBaseUrl}</small>
        </div>
      )}

      {loading ? (
        <div className="spinner"></div>
      ) : summary ? (
        <SummaryCards summary={summary} />
      ) : (
        <p className="text-muted">No data available</p>
      )}
    </div>
  );
}

export default Dashboard;
