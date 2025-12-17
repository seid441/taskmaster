const mysql = require("mysql2/promise");

// Create connection pool with PROPER configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.MYSQL_DB || "taskmaster",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection immediately
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to MySQL database!");
    connection.release();

    // Create tables
    await createTables();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

// Function to create tables
async function createTables() {
  let connection;
  try {
    connection = await pool.getConnection();

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Users table ready");

    // Create tasks table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        status ENUM('todo', 'in-progress', 'completed') DEFAULT 'todo',
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ Tasks table ready");
  } catch (error) {
    console.error("❌ Error creating tables:", error.message);
  } finally {
    if (connection) connection.release();
  }
}

// IMPORTANT: Export the pool directly
module.exports = pool;
