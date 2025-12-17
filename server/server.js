const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Test database connection BEFORE importing routes
console.log("🔍 Testing database connection...");
const pool = require("./config/database");

// Test query
(async () => {
  try {
    const [rows] = await pool.execute("SELECT 1 + 1 AS result");
    console.log("✅ Database test query successful:", rows);
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    console.log("⚠️ Server will start but database operations will fail");
  }
})();

// Import routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TaskMaster API is running!",
    timestamp: new Date().toISOString(),
    endpoints: [
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET  /api/tasks (protected)",
      "POST /api/tasks (protected)",
    ],
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} not found`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Available endpoints:`);
  console.log(`   • POST /api/auth/register`);
  console.log(`   • POST /api/auth/login`);
  console.log(`   • GET  /api/tasks (requires token)`);
  console.log(`   • POST /api/tasks (requires token)`);
});
