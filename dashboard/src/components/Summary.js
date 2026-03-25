import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Summary.css";

const Summary = () => {

  const [user, setUser] = useState(null);
  const [pnl, setPnl] = useState({
    realised: 0,
    unrealised: 0,
    total: 0
  });

  const [investment, setInvestment] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {

      try {

        // 🔹 Get user
        const userRes = await axios.get(
          "https://zerodha-backend-swdj.onrender.com/currentUser",
          {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
}
        );

        if (userRes.data.status) {
          setUser(userRes.data.user);
        }

        // 🔹 Get holdings
        const holdingsRes = await axios.get(
          "https://zerodha-backend-swdj.onrender.com/holdings",
          {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
}
        );

        const holdings = holdingsRes.data;

        let totalInvestment = 0;
        let totalCurrent = 0;

        holdings.forEach((stock) => {
          totalInvestment += stock.avg * stock.qty;
          totalCurrent += stock.price * stock.qty;
        });

        setInvestment(totalInvestment);
        setCurrentValue(totalCurrent);

        // 🔹 Get PnL
        const pnlRes = await axios.get(
          "https://zerodha-backend-swdj.onrender.com/pnl",
          {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
}
        );

        setPnl(pnlRes.data);

      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    };

    fetchData();

  }, []);

  if (loading) return <h3>Loading...</h3>;
  if (!user) return <h3>Please login</h3>;

  const pnlPercent =
    investment > 0 ? (pnl.total / investment) * 100 : 0;

  const pnlClass = pnl.total >= 0 ? "profit" : "loss";

  return (
    <>
      <div className="username">
        <h6>Hi, {user.username}</h6>
        <hr className="divider" />
      </div>

      {/* ================= Equity Section ================= */}

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">

          <div className="first">
            <h3>{user.balance.toFixed(2)}</h3>
            <p>Margin available</p>
          </div>

          <hr />

          <div className="second">
            <p>
              Margins used <span>{investment.toFixed(2)}</span>
            </p>

            <p>
              Opening balance <span>{(user.balance + investment).toFixed(2)}</span>
            </p>

          </div>

        </div>

        <hr className="divider" />
      </div>

      {/* ================= Holdings Section ================= */}

      <div className="section">

        <span>
          <p>Holdings</p>
        </span>

        <div className="data">

          <div className="first">
            <h3 className={pnlClass}>
              {pnl.total.toFixed(2)}{" "}
              <small className={pnlClass} >({pnlPercent.toFixed(2)})%</small>
            </h3>

            <p>Total P&L</p>
          </div>

          <hr />

          <div className="second">

            <p>
              Current Value
              <span>{currentValue.toFixed(2)}</span>
            </p>

            <p>
              Investment
              <span>{investment.toFixed(2)}</span>
            </p>

            <p >
              Realised P&L
              <span  className={pnlClass}>{pnl.realised.toFixed(2)}</span>
            </p>

            <p >
              Unrealised P&L
              <span className={pnlClass}>{pnl.unrealised.toFixed(2)}</span>
            </p>

          </div>

        </div>

        <hr className="divider" />

      </div>
    </>
  );
};

export default Summary;