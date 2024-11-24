const db = require("../services/db");

class ChefLogin {
  static async verifyRestaurantId(restaurantId) {
    const [rows] = await db.execute(
      "SELECT * FROM restaurant_reg WHERE id = ?",
      [restaurantId]
    );
    return rows.length > 0; // Returns true if a match is found
  }
}

module.exports = ChefLogin;
