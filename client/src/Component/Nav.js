import { Link, useNavigate } from "react-router-dom";
import "./Nav.css";

function Nav({ isLoggedIn, user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
      navigate("/");
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">
          <span className="logo-icon">✅</span>
          <span className="logo-text">TaskMaster Pro</span>
        </Link>
      </div>

      <div className="nav-links">
        {isLoggedIn ? (
          <>
            <span className="welcome-text">
              Welcome, {user?.name || user?.email}!
            </span>
            <Link to="/tasks" className="nav-link">
              <span className="nav-icon">📋</span>
              <span className="nav-text">My Tasks</span>
            </Link>
            <button className="nav-link logout-btn" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>
              <span className="nav-text">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/register" className="nav-link">
              <span className="nav-icon">🚀</span>
              <span className="nav-text">Register</span>
            </Link>
            <Link to="/login" className="nav-link">
              <span className="nav-icon">🔐</span>
              <span className="nav-text">Login</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Nav;
