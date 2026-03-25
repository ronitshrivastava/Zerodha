import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Funds.css";

const API = "https://zerodha-backend-swdj.onrender.com";

const Funds = () => {
  const [userData, setUserData] = useState({
    balance: 0,
    availableMargin: 0,
    usedMargin: 0,
  });
  const [showInput, setShowInput] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const userRes = await axios.get(`${API}/currentUser`, config);

        let balance = 0;
        if (userRes.data.status) {
          balance = Number(userRes.data.user.balance || 0);
        }

        const holdingsRes = await axios.get(`${API}/holdings`, config);

        let usedMargin = 0;
        (holdingsRes.data || []).forEach((stock) => {
          usedMargin += Number(stock.avg || 0) * Number(stock.qty || 0);
        });

        setUserData({
          balance,
          availableMargin: balance,
          usedMargin,
        });
      } catch (err) {
        console.log("Funds fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddFundsClick = () => {
    setShowInput("add");
    setAmount("");
  };

  const handleWithdrawClick = () => {
    setShowInput("withdraw");
    setAmount("");
  };

  const handleConfirm = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const url =
      showInput === "add" ? `${API}/add` : `${API}/withdraw`;

    try {
      const res = await axios.post(
        url,
        { amount: Number(amount) },
        config
      );

      if (res.data.status) {
        const updatedBalance = Number(res.data.balance || 0);

        setUserData((prev) => ({
          ...prev,
          balance: updatedBalance,
          availableMargin: updatedBalance,
        }));

        setShowInput("");
        setAmount("");
      } else {
        alert(res.data.message || "Transaction failed");
      }
    } catch (err) {
      console.log("Funds transaction error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error processing transaction");
    }
  };

  const handleCancel = () => {
    setShowInput("");
    setAmount("");
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="funds-page">
      <div className="funds-header card">
        <h2>Funds</h2>
        <p>Instant, zero-cost fund transfers with UPI</p>

        <div className="balance">
          <div>
            <p>Available Margin</p>
            <h3>₹ {userData.availableMargin.toLocaleString()}</h3>
          </div>
        </div>

        {!showInput && (
          <div className="fund-buttons">
            <button className="btn add" onClick={handleAddFundsClick}>
              Add Funds
            </button>
            <button className="btn withdraw" onClick={handleWithdrawClick}>
              Withdraw
            </button>
          </div>
        )}

        {showInput && (
          <div className="fund-input">
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="fund-buttons">
              <button className="btn add" onClick={handleConfirm}>
                Confirm
              </button>
              <button className="btn withdraw" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="summary-cards">
        <div className="card">
          <p>Used Margin</p>
          <h4>₹ {userData.usedMargin.toLocaleString()}</h4>
        </div>
        <div className="card">
          <p>Available Cash</p>
          <h4>₹ {userData.balance.toLocaleString()}</h4>
        </div>
        <div className="card">
          <p>Opening Balance</p>
          <h4>₹ {userData.balance.toLocaleString()}</h4>
        </div>
        <div className="card">
          <p>Closing Balance</p>
          <h4>₹ {userData.balance.toLocaleString()}</h4>
        </div>
      </div>

      <div className="funds-footer card">
        <p>Start investing in commodities today</p>
        <a
          href="https://zerodha-frontend-fdv0.onrender.com"
          className="btn open-account"
        >
          Open Account
        </a>
      </div>
    </div>
  );
};

export default Funds;