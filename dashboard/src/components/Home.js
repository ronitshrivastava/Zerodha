import React, { useEffect, useState } from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      console.log("Token received:", tokenFromUrl);

      // ✅ Save token for dashboard domain
      localStorage.setItem("token", tokenFromUrl);

      // ✅ Clean URL (remove token from address bar)
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    setReady(true);
  }, []);

  // ⛔ wait before rendering Dashboard
  if (!ready) return <h3>Loading...</h3>;

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;