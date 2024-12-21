// models/User.js
const bcrypt = require("bcrypt");
const pool = require("../services/db");
class User {
  constructor({
    email,
    password,
    restaurantName,
    ownerName,
    address,
    phoneNumber,
  }) {
    this.email = email;
    this.password = password;
    this.restaurantName = restaurantName;
    this.ownerName = ownerName;
    this.address = address;
    this.phoneNumber = phoneNumber;
  }

  // Method to hash the user's password before saving
  async hashPassword() {
    try {
      // bcrypt.hash() expects the password and the number of salt rounds as arguments
      this.password = await bcrypt.hash(this.password, 10); // 10 is the salt rounds
    } catch (error) {
      console.error("Error hashing password: ", error);
      throw error; // Ensure any errors during hashing are caught
    }
  }

  // Method to save the user to the database
  async save() {
    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO restaurant_reg (email, password, restaurantName, ownerName, address, phoneNumber) VALUES (?, ?, ?, ?, ?, ?)",
      [
        this.email,
        this.password,
        this.restaurantName,
        this.ownerName,
        this.address,
        this.phoneNumber,
      ]
    );
    connection.release();
  }
}

module.exports = User;
