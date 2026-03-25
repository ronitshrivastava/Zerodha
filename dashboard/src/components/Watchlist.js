import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";
import { DoughnutChart } from "./DoughnoutChart";
import { FaTrash } from "react-icons/fa";
import "./Watchlist.css";

const API = "https://zerodha-backend-swdj.onrender.com";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [newStockName, setNewStockName] = useState("");
  const [newStockPrice, setNewStockPrice] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [holdingsRes, watchlistRes, userRes] = await Promise.all([
          axios.get(`${API}/holdings`, config),
          axios.get(`${API}/watchlist`, config),
          axios.get(`${API}/currentUser`, config),
        ]);

        setHoldings(holdingsRes.data || []);
        setWatchlist(watchlistRes.data.watchlist || []);
        setUser(userRes.data.user || null);
      } catch (err) {
        console.log("Fetch watchlist/holdings/currentUser error:", err);
      }
    };

    fetchData();
  }, []);

  const handleAddStock = async () => {
    if (!newStockName.trim() || !newStockPrice.trim()) {
      return alert("Name & Price required");
    }

    try {
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

      const res = await axios.post(
        `${API}/watchlist/add`,
        {
          name: newStockName.trim(),
          price: Number(newStockPrice),
        },
        config
      );

      if (res.data.status) {
        setWatchlist((prev) => [...prev, res.data.stock]);
        setNewStockName("");
        setNewStockPrice("");
        setShowAddInput(false);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log("Add stock error:", err);
      alert("Failed to add stock");
    }
  };

  const handleDeleteStock = async (id) => {
    try {
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

      const res = await axios.delete(`${API}/watchlist/${id}`, config);

      if (res.data.status) {
        setWatchlist((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      console.log("Delete stock error:", err);
      alert("Failed to remove stock");
    }
  };

  const filteredWatchlist = watchlist.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = {
    labels: filteredWatchlist.map((s) => s.name),
    datasets: [
      {
        label: "Price",
        data: filteredWatchlist.map((s) => s.price || 0),
        backgroundColor: filteredWatchlist.map((_, i) =>
          [
            "rgba(255,99,132,0.5)",
            "rgba(54,162,235,0.5)",
            "rgba(255,206,86,0.5)",
          ][i % 3]
        ),
        borderColor: filteredWatchlist.map((_, i) =>
          [
            "rgba(255,99,132,1)",
            "rgba(54,162,235,1)",
            "rgba(255,206,86,1)",
          ][i % 3]
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div
        className="search-container"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <input
          type="text"
          placeholder="Search eg: INFY, RELIANCE"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search"
          style={{
            flex: 1,
            color: "#111",
            fontWeight: 500,
            fontSize: "14px",
            padding: "6px 10px",
          }}
        />

        {!showAddInput ? (
          <button
            className="btn add-stock-btn"
            style={{ padding: "6px 12px", fontSize: "14px" }}
            onClick={() => {
              if (!user) {
                alert("Please login first");
                return;
              }
              setShowAddInput(true);
            }}
          >
            + Add Stock
          </button>
        ) : (
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              type="text"
              placeholder="Stock Symbol"
              value={newStockName}
              onChange={(e) => setNewStockName(e.target.value)}
              className="add-stock-input"
              style={{ padding: "6px 8px" }}
            />
            <input
              type="number"
              placeholder="Price"
              value={newStockPrice}
              onChange={(e) => setNewStockPrice(e.target.value)}
              className="add-stock-input"
              style={{ padding: "6px 8px", width: "80px" }}
            />
            <button
              className="btn confirm-btn"
              onClick={handleAddStock}
              style={{ padding: "6px 10px" }}
            >
              Add
            </button>
            <button
              className="btn cancel-btn"
              onClick={() => setShowAddInput(false)}
              style={{ padding: "6px 10px" }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <ul className="list">
        {filteredWatchlist.map((stock) => (
          <WatchListItem
            key={stock._id}
            stock={stock}
            holdings={holdings}
            onDelete={() => handleDeleteStock(stock._id)}
          />
        ))}
      </ul>

      <div className="doughnut-container">
        <DoughnutChart data={chartData} />
      </div>
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock, holdings, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const generalContext = useContext(GeneralContext);

  const isOwned = holdings?.some(
    (item) => item.name.toLowerCase() === stock.name.toLowerCase()
  );

  return (
    <li
      className="watchlist-row"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="watch-row">
        <p className="stock-name">{stock.name}</p>

        {!showActions && (
          <div className="itemInfo">
            <span className="percent">{stock.percent || 0}%</span>

            {stock.isDown ? (
              <KeyboardArrowDown className="down" />
            ) : (
              <KeyboardArrowUp className="up" />
            )}

            <span className="price">₹{stock.price || 0}</span>
          </div>
        )}

        {showActions && (
          <div className="actions">
            <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
              <button
                className="buy"
                onClick={() => generalContext.openActionWindow(stock.name, "BUY")}
              >
                Buy
              </button>
            </Tooltip>

            <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
              <button
                className="sell"
                disabled={!isOwned}
                onClick={() => generalContext.openActionWindow(stock.name, "SELL")}
              >
                Sell
              </button>
            </Tooltip>

            <Tooltip title="Delete" placement="top" arrow TransitionComponent={Grow}>
              <button className="delete" onClick={onDelete}>
                <FaTrash />
              </button>
            </Tooltip>

            <Tooltip title="Analytics" placement="top" arrow TransitionComponent={Grow}>
              <button className="icon-btn">
                <BarChartOutlined />
              </button>
            </Tooltip>

            <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
              <button className="icon-btn">
                <MoreHoriz />
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    </li>
  );
};