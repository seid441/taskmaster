const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database"); // This should work now!

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  console.log("📝 Registration attempt:", req.body.email);

  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Please provide email, password, and name",
      });
    }

    // Check if user exists
    const [existingUsers] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.execute(
      "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
      [email, hashedPassword, name]
    );

    console.log("✅ User created with ID:", result.insertId);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  console.log("🔐 Login attempt:", req.body.email);

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    // Find user
    const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "fallback-secret-key",
      { expiresIn: "24h" }
    );

    console.log("✅ Login successful for user:", user.email);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
