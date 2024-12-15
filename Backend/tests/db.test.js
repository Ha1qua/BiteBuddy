// db.test.js
const pool = require("../services/db"); // Adjust the path according to your project structure

describe("Database Connection Tests", () => {
  test("should create a pool with correct parameters", async () => {
    // Test if the connection pool can be created successfully
    const connection = await pool.getConnection();
    expect(connection).toBeDefined();
    connection.release(); // Always release the connection after use
  });

  test("should return correct query result", async () => {
    // Test a simple SQL query
    const [rows] = await pool.query("SELECT 1 + 1 AS sum");
    expect(rows[0].sum).toBe(2); // Expect the result of 1 + 1 to be 2
  });

  test("should throw error if query fails", async () => {
    // Simulate a query failure (invalid SQL query)
    await expect(
      pool.query("SELECT * FROM non_existent_table")
    ).rejects.toThrow(); // Expect an error to be thrown
  });
});
