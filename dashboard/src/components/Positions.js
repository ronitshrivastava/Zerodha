import React, { useState, useEffect } from "react";
import axios from "axios";

const Positions = () => {

  const [allPositions, setAllPositions] = useState([]);

  useEffect(() => {

    axios.get("https://zerodha-backend-swdj.onrender.com/positions", {
      withCredentials: true
    })
    .then((res) => {
      console.log(res.data);
      setAllPositions(res.data);
    })
    .catch((err) => {
      console.log(err);
    });

  }, []);

  const totalInvestment = allPositions.reduce(
  (acc, stock) => acc + stock.avg * stock.qty,
  0
);

const totalCurrentValue = allPositions.reduce(
  (acc, stock) => acc + stock.price * stock.qty,
  0
);

const totalPnL = totalCurrentValue - totalInvestment;

const totalClass = totalPnL >= 0 ? "profit" : "loss";
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
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>

          <tbody>
            {allPositions.map((stock, index) => {

              const curValue = stock.price * stock.qty;
              const investment = stock.avg * stock.qty;
              const pnl = curValue - investment;

              const isProfit = pnl >= 0;
              const profClass = isProfit ? "profit" : "loss";

              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>

                  <td className={profClass}>
                    {pnl.toFixed(2)}
                  </td>

                  <td className={dayClass}>
                    {stock.day || "0"}
                  </td>
                </tr>
              );

            })}
          </tbody>
          <tfoot>
  <tr>
    <td colSpan="4"><b>Total</b></td>

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