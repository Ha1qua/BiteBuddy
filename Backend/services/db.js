const mysql = require("mysql2/promise");
require("dotenv").config(); // Load environment variables

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

(async () => {
  const testName = "Database Connection Test";
  const testResult = true; // Set to true because the connection was successful

  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully!");

    // Insert the test result into the database
    await connection.query(
      "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
      [testName, testResult]
    );

    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error("Database connection failed:", error.message);

    // Insert the failed test result into the database
    const testResult = false; // Set to false because the connection failed
    try {
      const connection = await pool.getConnection();
      await connection.query(
        "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
        [testName, testResult]
      );
      connection.release(); // Release the connection back to the pool
    } catch (error) {
      console.error("Failed to log the test result:", error.message);
    }
  }
})();

module.exports = pool;
