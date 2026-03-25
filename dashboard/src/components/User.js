import React, { useEffect, useState } from "react";
import axios from "axios";
import "./User.css";

const API = "https://zerodha-backend-swdj.onrender.com";

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API}/currentUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.log("Current user error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await axios.get(`${API}/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

      window.location.href = "https://zerodha-frontend-fdv0.onrender.com";
    } catch (error) {
      console.log("Logout failed", error.response?.data || error.message);
    }
  };

  if (loading) return <h3>Loading...</h3>;

  if (!user) {
    return (
      <div className="login-required">
        <h2>You are not logged in</h2>
        <p>Please login to view your account details</p>

        <a
          href="https://zerodha-frontend-fdv0.onrender.com/login"
          className="login-btn"
        >
          Login to your account
        </a>
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="account-card">
        <h2>Account Information</h2>

        <div className="account-field">
          <span>Username</span>
          <p>{user.username}</p>
        </div>

        <div className="account-field">
          <span>Email</span>
          <p>{user.email}</p>
        </div>

        <div className="account-field">
          <span>User ID</span>
          <p>{user._id}</p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Account;