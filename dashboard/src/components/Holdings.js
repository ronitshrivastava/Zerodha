import React, { useState, useEffect } from "react";
import { VerticalGraph } from "./VerticalGraph";
import axios from "axios";

const API = "https://zerodha-backend-swdj.onrender.com";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API}/holdings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAllHoldings(res.data || []);
      } catch (err) {
        console.log("Holdings fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHoldings();
  }, []);

  const labels = allHoldings.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => Number(stock.price || 0)),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const totalInvestment = allHoldings.reduce(
    (acc, stock) => acc + Number(stock.avg || 0) * Number(stock.qty || 0),
    0
  );

  const totalCurrentValue = allHoldings.reduce(
    (acc, stock) => acc + Number(stock.price || 0) * Number(stock.qty || 0),
    0
  );

  const totalPnL = totalCurrentValue - totalInvestment;

  const totalPnLPercent =
    totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

  const totalClass = totalPnL >= 0 ? "profit" : "loss";

  if (loading) return <h3>Loading...</h3>;

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&amp;L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>

          <tbody>
            {allHoldings.map((stock, index) => {
              const avg = Number(stock.avg || 0);
              const qty = Number(stock.qty || 0);
              const price = Number(stock.price || 0);

              const investment = avg * qty;
              const curValue = price * qty;
              const pnl = curValue - investment;
              const pnlPercent = investment > 0 ? (pnl / investment) * 100 : 0;

              const profClass = pnl >= 0 ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={stock._id || index}>
                  <td>{stock.name}</td>
                  <td>{qty}</td>
                  <td>{avg.toFixed(2)}</td>
                  <td>{price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>{pnl.toFixed(2)}</td>
                  <td className={profClass}>
                    ({pnlPercent.toFixed(2)}%) {stock.net || ""}
                  </td>
                  <td className={dayClass}>{stock.day || 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>{totalInvestment.toFixed(2)}</h5>
          <p>Total investment</p>
        </div>

        <div className="col">
          <h5>{totalCurrentValue.toFixed(2)}</h5>
          <p>Current value</p>
        </div>

        <div className="col">
          <h5 className={totalClass}>
            {totalPnL.toFixed(2)} ({totalPnLPercent.toFixed(2)}%)
          </h5>
          <p>P&amp;L</p>
        </div>
      </div>

      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;