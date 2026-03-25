import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Menu = () => {
  const location = useLocation(); // get current URL path
  const [user, setUser] = useState(null);

  // Fetch logged in user
  useEffect(() => {
    axios.get("https://zerodha-backend-swdj.onrender.com/currentUser", {
      withCredentials: true
    })
    .then(res => setUser(res.data.user))
    .catch(err => console.log(err));
  },
  
   []);

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  // Map paths to index (optional, but useful for active class logic)
  const pathToIndex = {
    "/": 0,
    "/orders": 1,
    "/holdings": 2,
    "/positions": 3,
    "/funds": 4,
    "/apps": 5,
    "/accounts": 6
  };

  const selectedMenu = pathToIndex[location.pathname] || 0;

  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "50px" }} alt="logo" />

      <div className="menus">
        <ul>
          <li>
            <Link style={{ textDecoration: "none" }} to="/">
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>

          <li>
            <Link style={{ textDecoration: "none" }} to="/orders">
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>

          <li>
            <Link style={{ textDecoration: "none" }} to="/holdings">
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>

          <li>
            <Link style={{ textDecoration: "none" }} to="/positions">
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>

          <li>
            <Link style={{ textDecoration: "none" }} to="/funds">
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>

          <li>
            <Link style={{ textDecoration: "none" }} to="/apps">
              <p className={selectedMenu === 5 ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>

          <li>
            <Link style={{ textDecoration: "none" }} to="/accounts">
              <div className="profile-section">
                <div className="avatar">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <p>{user?.username || "Login"}</p>
              </div>
            </Link>
          </li>
        </ul>

        <hr />
      </div>
    </div>
  );
};

export default Menu;