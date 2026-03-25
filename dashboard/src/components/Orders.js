import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);

 useEffect(() => {
  axios.get("https://zerodha-backend-swdj.onrender.com/myOrders", { withCredentials: true })
    .then(res => {
      if (res.data.status) {
        setOrders(res.data.orders);
      }
    })
    .catch((err) => {
        console.log(err);
      });
}, []);


  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://zerodha-backend-swdj.onrender.com/deleteOrder/${id}`, {
        withCredentials: true,
      });

      setOrders(orders.filter((order) => order._id !== id));
    } catch (err) {
      console.log(err);
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
            {orders.map((order, index) => (
              <tr key={index}>
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
                <td>
                  {new Date(order.createdAt).toLocaleString()}
                </td>
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