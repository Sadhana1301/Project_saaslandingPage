const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");        // ✅ fixed
const authRoutes = require("./auth");     // ✅ fixed

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.static(".")); // serve index.html, thankyou.html, css, js

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
