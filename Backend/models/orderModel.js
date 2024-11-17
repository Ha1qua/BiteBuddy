const db = require("../services/db"); // Database connection

const Order = {
  /**
   * Create a new order in the `orders` table
   * @param {number} restaurantId - The ID of the restaurant
   * @param {string} tableNumber - The table number
   * @param {number} totalPrice - Total price of the order
   * @returns {number} orderId - The generated order ID
   */
  createOrder: async (restaurantId, tableNumber, totalPrice) => {
    const [result] = await db.execute(
      `INSERT INTO orders (restaurant_id, table_number, total_price) VALUES (?, ?, ?)`,
      [restaurantId, tableNumber, totalPrice]
    );
    return result.insertId; // Return the generated order ID
  },
};

module.exports = Order;
