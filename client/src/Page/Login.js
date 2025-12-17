import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login({ setIsLoggedIn, setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/login",
        form
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setIsLoggedIn(true);
      setUser(res.data.user);
      alert("Login Successful!");
      navigate("/tasks");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back! 👋</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
          <button type="submit">Login</button>
        </form>
        <p className="switch-form">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
