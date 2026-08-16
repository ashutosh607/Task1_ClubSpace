require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);



const app = express();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error.message);
  });

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
  })
);


app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const authRouter = require("./routes/auth/auth-routes");
app.use("/api/auth", authRouter);

const adminRouter = require("./routes/admin/admin-routes");
app.use("/api/admin", adminRouter);

const userRouter = require("./routes/user/user-routes");
app.use("/api/user", userRouter);




app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at: http://localhost:${PORT}`);
});