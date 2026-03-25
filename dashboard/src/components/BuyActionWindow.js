import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const ActionWindow = ({ uid, mode }) => {
  const { closeActionWindow } = useContext(GeneralContext);
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!qty || qty <= 0 || !price || price <= 0) {
      setMessage({
        type: "error",
        text: "Quantity and Price must be greater than 0",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://zerodha-backend-swdj.onrender.com/orders",
        {
          name: uid,
          qty: Number(qty),
          price: Number(price),
          mode: mode,
          
        },
        {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
}
      );

      setMessage({
        type: "success",
        text: res.data.message || `${mode} successful`,
      });

      setTimeout(() => {
        closeActionWindow();
        navigate("/holdings");
      }, 1200);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Order failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="action-overlay">
      <div className="action-container">
        <h3 className="action-title">
          {mode} {uid}
        </h3>

        <div className="input-group">
          <label>Quantity</label>
          <input
            type="number"
            value={qty}
            min="1"
            onChange={(e) => setQty(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Price</label>
          <input
            type="number"
            step="0.05"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="button-group">
          <button
            className={`primary-btn ${
              mode === "BUY" ? "buy-btn" : "sell-btn"
            }`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : mode}
          </button>

          <button
            className="secondary-btn"
            onClick={closeActionWindow}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionWindow;