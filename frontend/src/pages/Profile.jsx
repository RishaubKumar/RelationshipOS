import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Profile = ({ user, onUserUpdate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name) {
      setError('Name is required');
      return;
    }

    if (password && password.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await api.put('/auth/profile', { name, password });
      const updatedUser = res.data.user;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      setSuccess('Profile details updated successfully!');
      setPassword('');
      setConfirmPassword('');

    } catch (err) {
      console.error(err);
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Failed to update profile info.'
      );
    } finally {
      setLoading(false);
    }
  };

  // calculate button label using standard if-else instead of ternary
  let buttonText = 'Save Profile Changes';
  if (loading) {
    buttonText = 'Saving Changes...';
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">User Profile</h2>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Manage your account settings and credentials</p>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="split-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="card" style={{ maxWidth: '600px' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Profile Details</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address (Read-only)</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                disabled
                style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
              />
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', margin: '24px 0' }}></div>
            
            <div className="card-title" style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Change Password (Optional)</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Leave blank to keep current"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Leave blank to keep current"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {buttonText}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
