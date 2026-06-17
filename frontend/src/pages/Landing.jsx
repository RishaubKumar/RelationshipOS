import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const token = localStorage.getItem('token');

  // calculate navbar action buttons using standard if-else instead of ternary
  let navButtons;
  if (token) {
    navButtons = (
      <Link to="/dashboard" className="btn btn-primary btn-sm">
        Dashboard
      </Link>
    );
  } else {
    navButtons = (
      <>
        <Link to="/login" className="btn btn-secondary btn-sm">
          Login
        </Link>
        <Link to="/register" className="btn btn-primary btn-sm">
          Register
        </Link>
      </>
    );
  }

  // calculate hero action buttons using standard if-else instead of ternary
  let heroButtons;
  if (token) {
    heroButtons = (
      <Link to="/dashboard" className="btn btn-primary">
        Go to Dashboard
      </Link>
    );
  } else {
    heroButtons = (
      <>
        <Link to="/register" className="btn btn-primary">
          Get Started for Free
        </Link>
        <Link to="/login" className="btn btn-secondary">
          Login
        </Link>
      </>
    );
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-logo">
          RelationshipOS
          <span>EPSILON EXPEDITION HACKATHON</span>
        </div>
        <div className="landing-nav-buttons">
          {navButtons}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <h1 className="hero-title">
          Know which customers are leaving <span>before they do.</span>
        </h1>
        <p className="hero-subtitle">
          RelationshipOS helps businesses predict customer churn in real time and generates AI-powered retention campaigns using Gemini API. Developed as a showcase hackathon project for Epsilon TeXpedition.
        </p>
        <div className="hero-actions">
          {heroButtons}
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h3>Supercharge Customer Success</h3>
          <p>Everything you need to analyze customer satisfaction and secure loyalty</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-text">
              Feature 1
            </div>
            <h4>Churn Prediction</h4>
            <p>Our rule-based heuristic calculations immediately categorize customers into risk tiers (High, Medium, Low) based on active days and satisfaction.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-text">
              Feature 2
            </div>
            <h4>Customer Analytics</h4>
            <p>Beautiful chart summaries of risk distribution, customer satisfaction rankings, and transaction histories so you see trends instantly.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-text">
              Feature 3
            </div>
            <h4>AI Retention Suggestions</h4>
            <p>Leverage the Gemini API to analyze customer indicators and produce actionable churn diagnoses and personalized discount offers.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-text">
              Feature 4
            </div>
            <h4>Marketing Insights</h4>
            <p>Receive tailored marketing strategies designed to capture the attention of sliding customer segments and re-ignite engagement.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} RelationshipOS. Built for the Epsilon TeXpedition Hackathon.</p>
      </footer>
    </div>
  );
};

export default Landing;
