import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const isLoggedIn = !!user;

  return (
    <div className="dashboard">
      <div className="hero-section">
        <h1>Welcome to TaskMaster Pro 🎯</h1>
        <p>Your ultimate task management solution</p>

        {isLoggedIn ? (
          <div className="dashboard-actions">
            <h2>Welcome back, {user?.name}!</h2>
            <div className="action-buttons">
              <Link to="/tasks" className="primary-btn">
                📋 View My Tasks
              </Link>
              <Link to="/tasks" className="secondary-btn">
                ➕ Create New Task
              </Link>
            </div>
          </div>
        ) : (
          <div className="dashboard-actions">
            <h2>Get started with TaskMaster</h2>
            <p>Organize your life, one task at a time</p>
            <div className="action-buttons">
              <Link to="/register" className="primary-btn">
                🚀 Get Started Free
              </Link>
              <Link to="/login" className="secondary-btn">
                🔐 Login
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">✅</div>
          <h3>Easy Task Management</h3>
          <p>Create, edit, and organize tasks effortlessly</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Track Progress</h3>
          <p>Monitor your productivity with visual stats</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔔</div>
          <h3>Never Miss Deadlines</h3>
          <p>Get reminders for upcoming due dates</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
