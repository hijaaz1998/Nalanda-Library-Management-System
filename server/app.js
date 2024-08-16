require("dotenv").config();
const express = require("express");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const borrowRoutes = require("./routes/borrowRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Connect to the database
connectDB.connect();

// Middleware
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/report", reportRoutes);

app.listen(process.env.PORT, () => {
  console.log("server started");
});
