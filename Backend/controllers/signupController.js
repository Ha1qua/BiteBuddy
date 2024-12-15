const User = require("../models/User");
const pool = require("../services/db");

const signUp = async (req, res) => {
  const { email, password, restaurantName, ownerName, address, phoneNumber } =
    req.body;

  try {
    const connection = await pool.getConnection();

    // Assuming User.save() saves a new restaurant to the DB
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

    // Log the success into a test table
    await connection.query(
      "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
      ["User Signup Test", true]
    );
    connection.release();

    // Respond with success
    res.status(201).json({ message: "Restaurant registered successfully!" });
  } catch (error) {
    // Handle errors (e.g., database issues)
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
