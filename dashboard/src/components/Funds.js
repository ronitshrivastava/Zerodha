import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Funds.css";

const Funds = () => {
  const [userData, setUserData] = useState({
    balance: 0,
    availableMargin: 0,
    usedMargin: 0,
  });
  const [showInput, setShowInput] = useState(""); // "add" or "withdraw" or ""
  const [amount, setAmount] = useState("");

  // Fetch user balance and holdings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(
          "http://13.61.112.94:3002/currentUser",
          { withCredentials: true }
        );

        let balance = 0;
        if (userRes.data.status) {
          balance = userRes.data.user.balance;
        }

        const holdingsRes = await axios.get(
          "http://13.61.112.94:3002/holdings",
          { withCredentials: true }
        );

        let usedMargin = 0;
        holdingsRes.data.forEach((stock) => {
          usedMargin += stock.avg * stock.qty; // investment in holdings
        });

        setUserData({
          balance: balance,
          availableMargin: balance, // available margin same as balance
          usedMargin: usedMargin,
        });
      } catch (err) {
        console.log(err);
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
    if (!amount || amount <= 0) return alert("Enter a valid amount");

    const url =
      showInput === "add"
        ? "http://13.61.112.94:3002/add"
        : "http://13.61.112.94:3002/withdraw";

    try {
      const res = await axios.post(url, { amount }, { withCredentials: true });

      if (res.data.status) {
        setUserData((prev) => ({
          ...prev,
          balance: res.data.balance,
          availableMargin: res.data.balance,
        }));
        setShowInput("");
        setAmount("");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Error processing transaction");
    }
  };

  const handleCancel = () => {
    setShowInput("");
    setAmount("");
  };

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

      {/* Bottom CTA */}
      <div className="funds-footer card">
        <p>Start investing in commodities today</p>
        <a href="https://main.d3tv0bgdl8zjki.amplifyapp.com/signup" className="btn open-account">
          Open Account
        </a>
      </div>
    </div>
  );
};

export default Funds;