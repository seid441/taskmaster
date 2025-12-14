import { Link } from "react-router-dom";
import "./Nav.css";

function Nav({ isLoggedIn }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">✅ TaskMaster</Link>
      </div>
      <div className="nav-links">
        {isLoggedIn ? (
          <>
            <Link to="/tasks" className="nav-link">
              My Tasks
            </Link>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <button className="nav-link logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/register" className="nav-link">
              Register
            </Link>
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Nav;
