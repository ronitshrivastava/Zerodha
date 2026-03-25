require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/AuthRoute");
const tradeRoutes = require("./routes/TradeRoutes");
const fundRoutes = require("./routes/FundRoutes");
const watchlistRoutes = require("./routes/WatchlistRoutes");

const app = express();

app.use(cors({
  origin: ["http://localhost:3000","http://localhost:3001","https://zerodha-frontend-fdv0.onrender.com","https://zerodha-dashboard-4tv0.onrender.com"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/", tradeRoutes);
app.use("/", fundRoutes);
app.use("/", watchlistRoutes);

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
  console.log("MongoDB connected");
  app.listen(process.env.PORT || 3002, ()=>{
    console.log(`Server running ${process.env.PORT}`);
  });
})
.catch(err=>console.log(err));