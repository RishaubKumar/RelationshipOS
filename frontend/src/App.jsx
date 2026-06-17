import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Analytics from './pages/Analytics';
import AiSuggestions from './pages/AiSuggestions';
import Profile from './pages/Profile';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // check if user is logged in on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (token && userJson) {
      try {
        setCurrentUser(JSON.parse(userJson));
      } catch (e) {
        console.error('Error parsing stored user details', e);
        localStorage.clear();
      }
    }
    setAuthChecked(true);
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  if (!authChecked) {
    return (
      <div className="spinner-container" style={{ height: '100vh' }}>
        <div className="spinner"></div>
        <p>Verifying authentication details...</p>
      </div>
    );
  }

  // route guard for private dashboard pages
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return (
      <Layout user={currentUser} onLogout={handleLogout}>
        {children}
      </Layout>
    );
  };

  // route check for login page using standard if-else instead of ternary
  const LoginRoute = () => {
    if (currentUser) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }
  };

  // route check for register page using standard if-else instead of ternary
  const RegisterRoute = () => {
    if (currentUser) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Register onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<RegisterRoute />} />

        {/* dashboard private routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-suggestions"
          element={
            <ProtectedRoute>
              <AiSuggestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile user={currentUser} onUserUpdate={handleUserUpdate} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
