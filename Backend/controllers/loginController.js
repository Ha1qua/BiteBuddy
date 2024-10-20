const db = require("../services/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// User Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user data from the 'restaurant_reg' table
    const [rows] = await db.query(
      "SELECT * FROM restaurant_reg WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};

module.exports = { login };
