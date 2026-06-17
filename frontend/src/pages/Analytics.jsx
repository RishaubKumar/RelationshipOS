import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics');
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load analytical reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading analytics visualization...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }

  // Handle empty state
  const totalCustomers = data?.summary?.totalCustomers || 0;
  if (totalCustomers === 0) {
    return (
      <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No Analytical Data Available</h3>
        <p style={{ color: '#64748b', maxWidth: '450px', margin: '0 auto 20px auto', fontSize: '14px' }}>
          We need customer profiles to calculate metrics. Please add customer details to unlock the database distributions.
        </p>
        <Link to="/customers" className="btn btn-primary">
          Register First Customer
        </Link>
      </div>
    );
  }

  const { summary, riskDistribution, customerDistribution } = data;

  const filteredRiskData = riskDistribution.filter(r => r.value > 0);

  // calculate the pie chart body using standard if-else instead of ternary
  let pieChartPanel;
  if (filteredRiskData.length === 0) {
    pieChartPanel = (
      <p style={{ textAlign: 'center', color: '#64748b', paddingTop: '100px' }}>No risk data recorded</p>
    );
  } else {
    pieChartPanel = (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredRiskData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {filteredRiskData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} Customers`, 'Total']} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Customer Analytics</h2>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Visual representation of risk segments, satisfaction rankings, and activity metrics</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="metric-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div>
            <span className="metric-label">Average Satisfaction</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span className="metric-value">{summary.averageSatisfaction}</span>
              <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>/ 10</span>
            </div>
          </div>
        </div>

        <div className="metric-card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div>
            <span className="metric-label">Average Customer Purchases</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span className="metric-value">${summary.averagePurchases}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charting section */}
      <div className="split-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Pie Chart Card */}
        <div className="card">
          <div className="card-title">
            <span>Churn Risk Breakdown</span>
          </div>
          <div style={{ width: '100%', height: '300px' }}>
            {pieChartPanel}
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="card">
          <div className="card-title">
            <span>Customer Purchase Distribution</span>
          </div>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={customerDistribution}
                margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-25} textAnchor="end" height={50} />
                <YAxis label={{ value: 'Purchases ($)', angle: -90, position: 'insideLeft', offset: -5 }} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`$${value}`, 'Purchases']} />
                <Bar dataKey="purchases" fill="#2563eb" radius={[4, 4, 0, 0]}>
                  {customerDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#2563eb" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
