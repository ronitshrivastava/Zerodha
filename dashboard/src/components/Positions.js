import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "https://zerodha-backend-swdj.onrender.com";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API}/positions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAllPositions(res.data || []);
      } catch (err) {
        console.log("Positions fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  const totalInvestment = allPositions.reduce(
    (acc, stock) => acc + Number(stock.avg || 0) * Number(stock.qty || 0),
    0
  );

  const totalCurrentValue = allPositions.reduce(
    (acc, stock) => acc + Number(stock.price || 0) * Number(stock.qty || 0),
    0
  );

  const totalPnL = totalCurrentValue - totalInvestment;
  const totalClass = totalPnL >= 0 ? "profit" : "loss";

  if (loading) return <h3>Loading...</h3>;

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&amp;L</th>
              <th>Chg.</th>
            </tr>
          </thead>

          <tbody>
            {allPositions.map((stock, index) => {
              const qty = Number(stock.qty || 0);
              const avg = Number(stock.avg || 0);
              const price = Number(stock.price || 0);

              const curValue = price * qty;
              const investment = avg * qty;
              const pnl = curValue - investment;

              const profClass = pnl >= 0 ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={stock._id || index}>
                  <td>{stock.name}</td>
                  <td>{qty}</td>
                  <td>{avg.toFixed(2)}</td>
                  <td>{price.toFixed(2)}</td>

                  <td className={profClass}>{pnl.toFixed(2)}</td>

                  <td className={dayClass}>{stock.day || "0"}</td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan="4">
                <b>Total</b>
              </td>

              <td className={totalClass}>
                <b>{totalPnL.toFixed(2)}</b>
              </td>

              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default Positions;