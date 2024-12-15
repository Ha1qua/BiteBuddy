const User = require("../models/User");
const pool = require("../services/db"); // Assuming the database connection is exported from services/db.js

const signUp = async (req, res) => {
  const { email, password, restaurantName, ownerName, address, phoneNumber } =
    req.body;

  const testName = "User Signup Test";

  try {
    // Create a new User instance
    const user = new User(
      email,
      password,
      restaurantName,
      ownerName,
      address,
      phoneNumber
    );

    // Hash the password and save the user
    await user.hashPassword(); // Hashes the password
    await user.save(); // Saves the user to the database

    // Log success to the connection_tests table
    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
      [testName, true]
    );
    connection.release();

    res.status(201).json({ message: "Restaurant registered successfully!" });
  } catch (error) {
    console.error(error);

    // Log failure to the connection_tests table
    try {
      const connection = await pool.getConnection();
      await connection.query(
        "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
        [testName, false]
      );
      connection.release();
    } catch (dbError) {
      console.error("Failed to log the test result:", dbError.message);
    }

    res
      .status(500)
      .json({ error: "Registration failed. Email may already be registered." });
  }
};

module.exports = { signUp };
