const db = require("../services/db"); // Database connection

const OrderDetails = {
  /**
   * Bulk insert multiple order details into the `order_details` table
   * @param {Array} orderDetails - Array of order detail objects
   */
  createOrderDetails: async (orderDetails) => {
    const values = orderDetails.map((detail) => [
      detail.orderId,
      detail.dishId,
      detail.quantity,
      detail.totalPrice, // Match `total_price` column in the DB
    ]);

    await db.query(
      `INSERT INTO order_details (order_id, dish_id, quantity, total_price) VALUES ?`, // Match `total_price`
      [values]
    );
  },
};

module.exports = OrderDetails;
