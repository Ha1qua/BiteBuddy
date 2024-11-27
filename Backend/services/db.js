const mysql = require("mysql2/promise");
require("dotenv").config(); // Load environment variables

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully!");
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
})();

module.exports = pool;
