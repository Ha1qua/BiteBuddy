const pool = require("../services/db");
const User = require("../models/User");
const signUp = async (req, res) => {
  const { email, password, restaurantName, ownerName, address, phoneNumber } =
    req.body;

  // Check if password is provided
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const connection = await pool.getConnection();

    const user = new User({
      email,
      password, // Assuming the password is hashed before saving
      restaurantName,
      ownerName,
      address,
      phoneNumber,
    });

    await user.hashPassword(); // Hash password before saving
    await user.save(); // Save the user to the database
    // Delete any existing test case with the same name
    await connection.query("DELETE FROM connection_tests WHERE test_name = ?", [
      "User Signup Test",
    ]);

    await connection.query(
      "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
      ["User Signup Test", true]
    );
    connection.release();

    res.status(201).json({ message: "Restaurant registered successfully!" });
  } catch (error) {
    console.error(error); // Print error to understand what went wrong
    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
      ["User Signup Test", false]
    );
    connection.release();

    res.status(500).json({
      error: "Registration failed. Email may already be registered.",
    });
  }
};
module.exports = { signUp };
