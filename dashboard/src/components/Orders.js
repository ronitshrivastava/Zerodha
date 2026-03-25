import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

const API = "https://zerodha-backend-swdj.onrender.com";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        const res = await axios.get(`${API}/myOrders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status) {
          setOrders(res.data.orders || []);
        }
      } catch (err) {
        console.log("Orders fetch error:", err.response?.data || err.message);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      await axios.delete(`${API}/deleteOrder/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      console.log("Delete order error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="orders-container">
      <h2>Orders</h2>

      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Mode</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Date</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.name}</td>

                <td
                  style={{
                    color: order.mode === "BUY" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {order.mode}
                </td>

                <td>{order.qty}</td>
                <td>₹{order.price}</td>
                <td>₹{order.qty * order.price}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(order._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;