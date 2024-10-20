const db = require("../services/db");
const bcrypt = require("bcrypt");

// User Registration (Sign Up)
const signUp = async (req, res) => {
  const { email, password, restaurantName, ownerName, address, phoneNumber } =
    req.body;

  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the data into 'restaurant_reg' table
    const query = `
      INSERT INTO restaurant_reg (email, password, restaurantName, ownerName, address, phoneNumber)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      email,
      hashedPassword,
      restaurantName,
      ownerName,
      address,
      phoneNumber,
    ]);

    res.status(201).json({ message: "Restaurant registered successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Registration failed. Email may already be registered." });
  }
};

module.exports = { signUp };
