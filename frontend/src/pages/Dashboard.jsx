import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    highRiskCount: 0,
    mediumRiskCount: 0,
    lowRiskCount: 0
  });
  const [highRiskCustomers, setHighRiskCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch stats from analytics endpoint
        const analyticsRes = await api.get('/analytics');
        if (analyticsRes.data && analyticsRes.data.summary) {
          setStats(analyticsRes.data.summary);
        }

        // Fetch detailed customer list to extract the high risk ones
        const customersRes = await api.get('/customers');
        const highRisk = customersRes.data.filter(c => c.churnRisk === 'High');
        setHighRiskCustomers(highRisk);

      } catch (err) {
        console.error(err);
        setError('Failed to fetch dashboard data. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading dashboard metrics...</p>
      </div>
    );
  }

  // calculate the high-risk action panel using if-else instead of ternary
  let highRiskActionPanel;
  if (highRiskCustomers.length === 0) {
    highRiskActionPanel = (
      <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
        <p style={{ fontWeight: 600 }}>No high risk customers detected.</p>
        <p style={{ fontSize: '12px', marginTop: '4px' }}>Keep maintaining active engagement and high satisfaction.</p>
      </div>
    );
  } else {
    highRiskActionPanel = (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Inactivity</th>
              <th>Satisfaction</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {highRiskCustomers.map(customer => (
              <tr key={customer._id}>
                <td style={{ fontWeight: 600 }}>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.lastActiveDays} days ago</td>
                <td>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>
                    {customer.satisfactionScore}/10
                  </span>
                </td>
                <td>
                  <Link
                    to="/ai-suggestions"
                    state={{ selectedCustomerId: customer._id }}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#2563eb', border: '1px solid #2563eb' }}
                  >
                    Generate AI Actions
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Operational Dashboard</h2>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Overview of customer churn statuses and health indicators</p>
        </div>
        <Link to="/customers" className="btn btn-primary">
          Manage Customers
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Total Customers</span>
          <span className="metric-value">{stats.totalCustomers}</span>
        </div>

        <div className="metric-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <span className="metric-label" style={{ color: '#ef4444' }}>High Risk</span>
          <span className="metric-value" style={{ color: '#ef4444' }}>{stats.highRiskCount}</span>
        </div>

        <div className="metric-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <span className="metric-label" style={{ color: '#f59e0b' }}>Medium Risk</span>
          <span className="metric-value" style={{ color: '#f59e0b' }}>{stats.mediumRiskCount}</span>
        </div>

        <div className="metric-card" style={{ borderLeft: '4px solid #10b981' }}>
          <span className="metric-label" style={{ color: '#10b981' }}>Low Risk</span>
          <span className="metric-value" style={{ color: '#10b981' }}>{stats.lowRiskCount}</span>
        </div>
      </div>

      {/* Main Section */}
      <div className="split-grid">
        <div className="card">
          <div className="card-title">
            <span>High Risk Action Items</span>
          </div>
          {highRiskActionPanel}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
