import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Summary.css";

const API = "https://zerodha-backend-swdj.onrender.com";

const Summary = () => {
  const [user, setUser] = useState(null);
  const [pnl, setPnl] = useState({
    realised: 0,
    unrealised: 0,
    total: 0,
  });

  const [investment, setInvestment] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const userRes = await axios.get(`${API}/currentUser`, config);

        if (userRes.data.status) {
          setUser(userRes.data.user);
        }

        const holdingsRes = await axios.get(`${API}/holdings`, config);
        const holdings = holdingsRes.data || [];

        let totalInvestment = 0;
        let totalCurrent = 0;

        holdings.forEach((stock) => {
          totalInvestment += Number(stock.avg || 0) * Number(stock.qty || 0);
          totalCurrent += Number(stock.price || 0) * Number(stock.qty || 0);
        });

        setInvestment(totalInvestment);
        setCurrentValue(totalCurrent);

        const pnlRes = await axios.get(`${API}/pnl`, config);

        setPnl(
          pnlRes.data || {
            realised: 0,
            unrealised: 0,
            total: 0,
          }
        );
      } catch (err) {
        console.log("Summary fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <h3>Loading...</h3>;
  if (!user) return <h3>Please login</h3>;

  const balance = Number(user.balance || 0);
  const pnlPercent = investment > 0 ? (pnl.total / investment) * 100 : 0;
  const pnlClass = pnl.total >= 0 ? "profit" : "loss";

  return (
    <>
      <div className="username">
        <h6>Hi, {user.username}</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>{balance.toFixed(2)}</h3>
            <p>Margin available</p>
          </div>

          <hr />

          <div className="second">
            <p>
              Margins used <span>{investment.toFixed(2)}</span>
            </p>

            <p>
              Opening balance <span>{(balance + investment).toFixed(2)}</span>
            </p>
          </div>
        </div>

        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={pnlClass}>
              {Number(pnl.total || 0).toFixed(2)}{" "}
              <small className={pnlClass}>({pnlPercent.toFixed(2)})%</small>
            </h3>

            <p>Total P&amp;L</p>
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

            <p>
              Realised P&amp;L
              <span className={pnlClass}>
                {Number(pnl.realised || 0).toFixed(2)}
              </span>
            </p>

            <p>
              Unrealised P&amp;L
              <span className={pnlClass}>
                {Number(pnl.unrealised || 0).toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;