import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// Import components
import Nav from "./Component/Nav";
import Login from "./Page/Login";
import Register from "./Page/Register";
import Dashboard from "./Page/Dashboard";
import TaskList from "./Page/TaskList";

// Private Route component to protect routes
const PrivateRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        // Verify token is still valid
        const response = await axios.get("http://localhost:4000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setIsLoggedIn(true);
          setUser(JSON.parse(userData));
        } else {
          clearAuth();
        }
      }
    } catch (error) {
      console.log("Not authenticated or token expired");
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    clearAuth();
    alert("Logged out successfully!");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="loading-fullscreen">
        <div className="loading-spinner"></div>
        <p>Loading TaskMaster Pro...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* Pass handleLogout to Nav */}
        <Nav isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />

        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={<Dashboard isLoggedIn={isLoggedIn} user={user} />}
            />
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/tasks" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/register"
              element={isLoggedIn ? <Navigate to="/tasks" /> : <Register />}
            />

            {/* Protected Routes */}
            <Route
              path="/tasks"
              element={
                <PrivateRoute isAuthenticated={isLoggedIn}>
                  <TaskList user={user} />
                </PrivateRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>
            ✅ TaskMaster Pro - Your Productivity Partner | Built with React &
            Node.js
          </p>
          <p className="footer-links">
            <a href="/">Home</a> •<a href="/login">Login</a> •
            <a href="/register">Register</a> •<a href="/tasks">Tasks</a>
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
