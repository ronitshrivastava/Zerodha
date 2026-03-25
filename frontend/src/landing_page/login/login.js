import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-center",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-center",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "https://zerodha-backend-swdj.onrender.com/login",
        { email, password },
        { withCredentials: true }
      );

      if (data.success) {
        handleSuccess(data.message);

        setTimeout(() => {
          window.location.href = "https://zerodha-dashboard-4tv0.onrender.com";
        }, 1000);
      } else {
        handleError(data.message || "Login failed");
      }
    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);
      handleError(error.response?.data?.message || "Server error");
    }

    setInputValue({ email: "", password: "" });
  };

  return (
    <>
      <div className="form_container">
        <h2>Login Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleOnChange}
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
              required
            />
          </div>

          <button type="submit">Submit</button>

          <span>
            Don't have an account? <Link to="/signup">Signup</Link>
          </span>
        </form>
      </div>

      <ToastContainer
        position="top"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        toastStyle={{
          marginBottom: "170px",
          borderRadius: "8px",
          padding: "12px 18px",
          paddingRight: "40px",
          fontSize: "14px",
          minWidth: "380px",
        }}
      />
    </>
  );
};

export default Login;