// routes/testcaseRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../services/db"); // Assuming the database connection is in db.js

// Get test cases
router.get("/api/testcases", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM connection_tests ORDER BY test_time DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching test cases:", error);
    res.status(500).json({ error: "Failed to fetch test cases" });
  }
});

module.exports = router;
