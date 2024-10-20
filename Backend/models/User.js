const bcrypt = require("bcrypt");
const db = require("../services/db");

class User {
  constructor(
    email,
    password,
    restaurantName,
    ownerName,
    address,
    phoneNumber
  ) {
    this.email = email;
    this.password = password;
    this.restaurantName = restaurantName;
    this.ownerName = ownerName;
    this.address = address;
    this.phoneNumber = phoneNumber;
  }

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async save() {
    const query = `
      INSERT INTO users (email, password, restaurantName, ownerName, address, phoneNumber) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      this.email,
      this.password,
      this.restaurantName,
      this.ownerName,
      this.address,
      this.phoneNumber,
    ];
    await db.execute(query, values);
  }

  static async findByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }

  static async comparePassword(providedPassword, storedPassword) {
    return await bcrypt.compare(providedPassword, storedPassword);
  }
}

module.exports = User;
