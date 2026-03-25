import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const res = await axios.post(
        "https://zerodha-stock-trading-platform-qb0o.onrender.com/login",
        formData,
        { withCredentials: true }
      );

      // after successful login/signup
      window.dispatchEvent(new Event("userLogin"));

      // Login success
      window.location.href = "https://zerodha-stock-trading-platform-2-r26t.onrender.com";

    } catch (error) {

      if (error.response?.status === 401) {
        setMessage("Invalid email or password");
      } else {
        setMessage("Something went wrong");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper d-flex align-items-center justify-content-center">
      <div className="card signup-card shadow-lg p-4">
        <h3 className="text-center mb-4 fw-bold">Login</h3>

        {message && (
          <div className="alert alert-danger py-2">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
              required
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              required
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="text-center mt-3">
            Don't have an account?{" "}
            <span
              style={{ color: "blue", cursor: "pointer", textDecoration: "none" }}
              onClick={() => navigate("/signup")}
            >
              Signup
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;