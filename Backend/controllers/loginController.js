const db = require("../services/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// User Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Remove any previous login attempt records (optional cleanup)
    await db.query("DELETE FROM connection_tests WHERE test_name = ?", [
      "Login Attempt",
    ]);

    // Fetch user data from the 'restaurant_reg' table
    const [rows] = await db.query(
      "SELECT * FROM restaurant_reg WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      // Log failed login attempt
      console.log("User not found, logging failed attempt.");
      await db.query(
        "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
        ["Login Attempt", false]
      );
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Log failed login attempt
      console.log("Invalid credentials, logging failed attempt.");
      await db.query(
        "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
        ["Login Attempt", false]
      );
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Log successful login attempt
    console.log("Login successful, logging successful attempt.");
    await db.query(
      "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
      ["Login Attempt", true]
    );

    // Respond with message, token, and restaurant ID
    res.json({
      message: "Login successful!",
      token,
      restaurantId: user.id, // Assuming user.id is the restaurant ID
    });
  } catch (error) {
    // Log failed login attempt due to error
    console.error("Error during login:", error);
    // await db.query(
    //   "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
    //   ["Login Attempt", false]
    // );
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};

module.exports = { login };
