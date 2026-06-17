import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Customers', path: '/customers' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'AI Suggestions', path: '/ai-suggestions' },
    { name: 'Profile', path: '/profile' }
  ];

  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-name">RelationshipOS</span>
          <span className="sidebar-brand-sub">EPSILON EXPEDITION HACKATHON</span>
        </div>
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            // calculate class names using if-else instead of ternary
            let itemClass = "sidebar-item";
            if (location.pathname === item.path) {
              itemClass = "sidebar-item active";
            }

            return (
              <li key={item.name} className={itemClass}>
                <Link to={item.path}>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Main Container Area */}
      <div className="main-container">
        {/* Top Navbar */}
        <nav className="navbar">
          <div className="navbar-project">
            <span>Project Workspace: Epsilon TeXpedition Demo</span>
          </div>
          <div className="navbar-user-section">
            {user && (
              <span className="navbar-username">
                User: {user.name}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Content Body */}
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
