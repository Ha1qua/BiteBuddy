const mysql = require("mysql2/promise");
require("dotenv").config(); // Load environment variables

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

(async () => {
  const testName = "Database Connection Test"; // Test name
  let testResult = false; // Default to false (failed)

  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully!");

    // Clear the table before inserting the new test result
    await connection.query("DELETE FROM connection_tests");

    testResult = true; // Set result to true if connection is successful
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }

  // Insert the test result into the database
  try {
    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
      [testName, testResult]
    );
    connection.release(); // Release the connection back to the pool
    console.log("Test result inserted into the database.");
  } catch (error) {
    console.error("Failed to log the test result:", error.message);
  }
})();

module.exports = pool;
