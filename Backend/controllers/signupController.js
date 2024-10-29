const User = require("../models/User"); // Import the User class

// User Registration (Sign Up)
const signUp = async (req, res) => {
  const { email, password, restaurantName, ownerName, address, phoneNumber } =
    req.body;

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

    res.status(201).json({ message: "Restaurant registered successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Registration failed. Email may already be registered." });
  }
};
module.exports = { signUp };
