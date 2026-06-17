import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

const AiSuggestions = () => {
  const location = useLocation();

  // State
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [error, setError] = useState('');
  const [customerDetails, setCustomerDetails] = useState(null);

  // Fetch customers on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true);
        const res = await api.get('/customers');
        setCustomers(res.data);

        // Check if a customer was passed from dashboard click
        if (location.state && location.state.selectedCustomerId) {
          setSelectedCustomerId(location.state.selectedCustomerId);
          // Trigger suggestion generation for this customer
          generateSuggestions(location.state.selectedCustomerId);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load customer list.');
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, [location]);

  // Update selected customer preview info
  useEffect(() => {
    if (selectedCustomerId) {
      const match = customers.find(c => c._id === selectedCustomerId);
      setCustomerDetails(match || null);
    } else {
      setCustomerDetails(null);
    }
  }, [selectedCustomerId, customers]);

  // Suggestion generator API trigger
  const generateSuggestions = async (customerIdToUse) => {
    const id = customerIdToUse || selectedCustomerId;
    if (!id) {
      setError('Please select a customer first.');
      return;
    }

    setError('');
    setSuggestions(null);
    setLoadingSuggestions(true);

    try {
      const res = await api.post('/ai/suggestion', { customerId: id });
      setSuggestions(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Failed to generate recommendations. Please try again later.'
      );
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    generateSuggestions();
  };

  const getRiskBadgeColor = (risk) => {
    if (risk === 'High') return '#ef4444';
    if (risk === 'Medium') return '#f59e0b';
    return '#10b981';
  };

  // 1. calculate submit button text using standard if-else instead of ternary
  let submitButtonText = 'Generate AI Strategy';
  if (loadingSuggestions) {
    submitButtonText = 'Analyzing...';
  }

  // 2. calculate selector layout using standard if-else instead of ternary
  let customerSelectSection;
  if (loadingCustomers) {
    customerSelectSection = (
      <p>Loading database profiles...</p>
    );
  } else if (customers.length === 0) {
    customerSelectSection = (
      <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
        <p>No customers registered. Please add a customer profile first.</p>
      </div>
    );
  } else {
    customerSelectSection = (
      <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <label className="form-label" htmlFor="customer-select">Choose Customer</label>
          <select
            id="customer-select"
            className="form-control"
            value={selectedCustomerId}
            onChange={(e) => {
              setSelectedCustomerId(e.target.value);
              setSuggestions(null);
              setError('');
            }}
          >
            <option value="">-- Choose from Database --</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.email}) - Churn Risk: {c.churnRisk}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loadingSuggestions || !selectedCustomerId}
        >
          <span>{submitButtonText}</span>
        </button>
      </form>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">AI Retention Actions</h2>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Generate tailored marketing campaigns, loyalty deals, and winback strategies using Gemini AI</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-title">
          <span>Select Customer Profile</span>
        </div>
        {customerSelectSection}
      </div>

      {/* Customer Preview Metrics */}
      {customerDetails && (
        <div className="card" style={{ backgroundColor: '#f8fafc', padding: '16px 24px', borderStyle: 'dashed' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Customer Name</p>
              <p style={{ fontWeight: 700, fontSize: '15px' }}>{customerDetails.name}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Assessed Risk</p>
              <p style={{ fontWeight: 700, fontSize: '15px', color: getRiskBadgeColor(customerDetails.churnRisk) }}>
                {customerDetails.churnRisk} Risk
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Satisfaction Score</p>
              <p style={{ fontWeight: 700, fontSize: '15px' }}>{customerDetails.satisfactionScore} / 10</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Last Active</p>
              <p style={{ fontWeight: 700, fontSize: '15px' }}>{customerDetails.lastActiveDays} days ago</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Purchases</p>
              <p style={{ fontWeight: 700, fontSize: '15px' }}>${customerDetails.totalPurchases}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Output Spinner */}
      {loadingSuggestions && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p style={{ fontWeight: 500, fontSize: '14px' }}>Sending customer data parameters to Gemini AI...</p>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Drafting customized retention offers...</p>
        </div>
      )}

      {/* AI Recommendation Output Cards */}
      {suggestions && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 12px 0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>AI Consultation Report</h3>
            <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '2px', backgroundColor: '#e2e8f0', color: '#475569', fontWeight: 600 }}>
              Engine: {suggestions.source}
            </span>
          </div>

          <div className="ai-results-grid">
            {/* 1. Churn Reason */}
            <div className="card ai-card ai-card-reason">
              <div className="card-title" style={{ color: '#ef4444' }}>
                <span>Churn Reason Analysis</span>
              </div>
              <p style={{ fontSize: '14px', color: '#334155' }}>
                {suggestions.churnReason}
              </p>
            </div>

            {/* 2. Retention Strategy */}
            <div className="card ai-card ai-card-strategy">
              <div className="card-title" style={{ color: '#f59e0b' }}>
                <span>Proposed Retention Plan</span>
              </div>
              <p style={{ fontSize: '14px', color: '#334155' }}>
                {suggestions.retentionStrategy}
              </p>
            </div>

            {/* 3. Marketing Recommendation */}
            <div className="card ai-card ai-card-marketing">
              <div className="card-title" style={{ color: '#2563eb' }}>
                <span>Marketing Recommendation</span>
              </div>
              <p style={{ fontSize: '14px', color: '#334155' }}>
                {suggestions.marketingRecommendation}
              </p>
            </div>

            {/* 4. Personalized Offer */}
            <div className="card ai-card ai-card-offer">
              <div className="card-title" style={{ color: '#10b981' }}>
                <span>Personalized Win-Back Offer</span>
              </div>
              <p style={{ fontSize: '14px', color: '#334155', fontWeight: 500 }}>
                {suggestions.personalizedOffer}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiSuggestions;
