import React, { useEffect, useState } from "react";
import axios from "axios";
import "./User.css";

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://zerodha-backend-swdj.onrender.com/currentUser", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
      .then((res) => {
        if (res.data.status) {
          setUser(res.data.user);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // ✅ Logout Function
  const handleLogout = async () => {
    try {
      await axios.get("https://zerodha-backend-swdj.onrender.com/logout", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

      setUser(null);
      window.location.href = "https://zerodha-frontend-fdv0.onrender.com"; // redirect to login page
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

  if (loading) return <h3>Loading...</h3>;
 if (!user) 
  return (
    <div className="login-required">
      <h2>You are not logged in</h2>
      <p>Please login to view your account details</p>

      <a href="https://zerodha-frontend-fdv0.onrender.com/login" className="login-btn">
        Login to your account
      </a>
    </div>
  );

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

        {/* ✅ Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Account;