import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Customers = () => {
  // State variables
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    totalPurchases: '',
    lastActiveDays: '',
    satisfactionScore: ''
  });

  const [editingId, setEditingId] = useState(null);

  // Fetch all customers on load
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch customers list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Form submission handler (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, email, age, totalPurchases, lastActiveDays, satisfactionScore } = formData;

    // Simple validations
    if (!name || !email || age === '' || totalPurchases === '' || lastActiveDays === '' || satisfactionScore === '') {
      setError('Please fill out all fields');
      return;
    }

    const ageNum = Number(age);
    const purchasesNum = Number(totalPurchases);
    const activeDaysNum = Number(lastActiveDays);
    const satisfactionNum = Number(satisfactionScore);

    if (ageNum < 1 || ageNum > 120) {
      setError('Age must be a valid number between 1 and 120');
      return;
    }

    if (purchasesNum < 0) {
      setError('Total purchases cannot be negative');
      return;
    }

    if (activeDaysNum < 0) {
      setError('Last active days cannot be negative');
      return;
    }

    if (satisfactionNum < 1 || satisfactionNum > 10) {
      setError('Satisfaction score must be between 1 and 10');
      return;
    }

    setSubmitLoading(true);

    try {
      if (editingId) {
        // Edit mode
        const res = await api.put(`/customers/${editingId}`, formData);
        setSuccess('Customer profile updated successfully!');
        setEditingId(null);
      } else {
        // Add mode
        const res = await api.post('/customers', formData);
        setSuccess('Customer added successfully!');
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        age: '',
        totalPurchases: '',
        lastActiveDays: '',
        satisfactionScore: ''
      });

      // Refresh list
      fetchCustomers();

    } catch (err) {
      console.error(err);
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Failed to process request'
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // Populate form for editing
  const handleEditClick = (customer) => {
    setEditingId(customer._id);
    setFormData({
      name: customer.name,
      email: customer.email,
      age: customer.age,
      totalPurchases: customer.totalPurchases,
      lastActiveDays: customer.lastActiveDays,
      satisfactionScore: customer.satisfactionScore
    });
    setError('');
    setSuccess('');
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      age: '',
      totalPurchases: '',
      lastActiveDays: '',
      satisfactionScore: ''
    });
  };

  // Delete customer record
  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer record?')) {
      return;
    }

    try {
      await api.delete(`/customers/${id}`);
      setSuccess('Customer record deleted successfully!');
      fetchCustomers();
    } catch (err) {
      console.error(err);
      setError('Failed to delete customer record');
    }
  };

  const getRiskBadgeClass = (risk) => {
    if (risk === 'High') return 'badge badge-high';
    if (risk === 'Medium') return 'badge badge-medium';
    return 'badge badge-low';
  };

  // 1. calculate form title using standard if-else instead of ternary
  let formTitle = 'Register New Customer';
  if (editingId) {
    formTitle = 'Edit Customer Info';
  }

  // 2. calculate submit button text using standard if-else instead of ternary
  let submitButtonText = 'Add Customer';
  if (submitLoading) {
    submitButtonText = 'Saving...';
  } else if (editingId) {
    submitButtonText = 'Update Customer';
  }

  // 3. calculate customer table panel using standard if-else instead of ternary
  let customerListPanel;
  if (loading && customers.length === 0) {
    customerListPanel = (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading database records...</p>
      </div>
    );
  } else if (customers.length === 0) {
    customerListPanel = (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        <p>No customers registered in database.</p>
        <p style={{ fontSize: '12px', marginTop: '4px' }}>Fill in the registration form on the left to add your first customer.</p>
      </div>
    );
  } else {
    customerListPanel = (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Purchases</th>
              <th>Last Active</th>
              <th>Satisfaction</th>
              <th>Risk</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td>{c.email}</td>
                <td>${c.totalPurchases}</td>
                <td>{c.lastActiveDays}d ago</td>
                <td style={{ fontWeight: 500 }}>{c.satisfactionScore}/10</td>
                <td>
                  <span className={getRiskBadgeClass(c.churnRisk)}>
                    {c.churnRisk}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button
                      onClick={() => handleEditClick(c)}
                      className="btn btn-secondary btn-sm"
                      title="Edit customer profile"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(c._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#ef4444' }}
                      title="Delete customer record"
                    >
                      Delete
                    </button>
                  </div>
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
      <div className="page-header">
        <div>
          <h2 className="page-title">Customer Database</h2>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Add, update, or remove customer accounts and review calculated churn risk</p>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="split-grid">
        {/* Left Column - Add / Edit Form */}
        <div>
          <div className="card">
            <div className="card-title">
              <span>{formTitle}</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Customer Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  placeholder="e.g. Acme Corp / Alex Smith"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  placeholder="e.g. contact@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="age">Age</label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  className="form-control"
                  placeholder="e.g. 28"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="totalPurchases">Total Purchases ($)</label>
                <input
                  type="number"
                  name="totalPurchases"
                  id="totalPurchases"
                  className="form-control"
                  placeholder="e.g. 450"
                  value={formData.totalPurchases}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="lastActiveDays">Last Active (Days Ago)</label>
                <input
                  type="number"
                  name="lastActiveDays"
                  id="lastActiveDays"
                  className="form-control"
                  placeholder="e.g. 12"
                  value={formData.lastActiveDays}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="satisfactionScore">Satisfaction Score (1 - 10)</label>
                <input
                  type="number"
                  name="satisfactionScore"
                  id="satisfactionScore"
                  className="form-control"
                  placeholder="e.g. 8"
                  min="1"
                  max="10"
                  value={formData.satisfactionScore}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={submitLoading}
                >
                  {submitButtonText}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Table display */}
        <div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div className="card-title" style={{ marginBottom: 0 }}>
                <span>Registered Customers ({customers.length})</span>
              </div>
              <button
                onClick={fetchCustomers}
                className="btn btn-secondary btn-sm"
                disabled={loading}
              >
                Refresh
              </button>
            </div>
            {customerListPanel}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
