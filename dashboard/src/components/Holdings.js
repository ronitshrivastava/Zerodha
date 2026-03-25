import React, { useState, useEffect } from "react";
import { VerticalGraph } from "./VerticalGraph";
import axios from "axios";
// import { holdings } from "../data/data";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);

  useEffect(() => {
    axios
      .get("https://zerodha-backend-swdj.onrender.com/holdings", {
        withCredentials: true,
      })
      .then((res) => {
        setAllHoldings(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const labels = allHoldings.map((subArray) => subArray["name"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  // export const data = {
  //   labels,
  //   datasets: [
  // {
  //   label: 'Dataset 1',
  //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
  //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
  // },
  //     {
  //       label: 'Dataset 2',
  //       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
  //       backgroundColor: 'rgba(53, 162, 235, 0.5)',
  //     },
  //   ],
  // };
  const totalInvestment = allHoldings.reduce(
  (acc, stock) => acc + stock.avg * stock.qty,
  0
);

const totalCurrentValue = allHoldings.reduce(
  (acc, stock) => acc + stock.price * stock.qty,
  0
);

const totalPnL = totalCurrentValue - totalInvestment;

const totalPnLPercent =
  totalInvestment > 0
    ? (totalPnL / totalInvestment) * 100
    : 0;

const totalClass = totalPnL >= 0 ? "profit" : "loss";

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg. cost</th>
            <th>LTP</th>
            <th>Cur. val</th>
            <th>P&L</th>
            <th>Net chg.</th>
            <th>Day chg.</th>
          </tr>

          {allHoldings.map((stock, index) => {
            const avg = stock.avg ?? 0;
            const investment = avg * stock.qty;
            const curValue = (stock.price ?? 0) * (stock.qty ?? 0);
            const pnl = curValue - investment;
            const pnlPercent = investment > 0 ? (pnl / investment) * 100 : 0;

            const isProfit = pnl >= 0;
            const profClass = isProfit ? "profit" : "loss";
            const dayClass = stock.isLoss ? "loss" : "profit";

            return (
              <tr key={index}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{(stock.avg ?? 0).toFixed(2)}</td>
                <td>{(stock.price ?? 0).toFixed(2)}</td>
                <td>{(curValue ?? 0).toFixed(2)}</td>
                <td className={profClass}>
                  {pnl.toFixed(2)} 
                </td>
                <td className={profClass}>({pnlPercent.toFixed(2)}%){stock.net}</td>
                <td className={dayClass}>{stock.day}</td>
              </tr>
            );
          })}
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
    <p>P&L</p>
  </div>
</div>
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
