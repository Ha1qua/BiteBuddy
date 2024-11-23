const db = require("../services/db"); // Database connection
const Order = require("../models/orderModel");
const OrderDetails = require("../models/orderDetailModel");

const saveOrder = async (req, res) => {
  const { restaurantId, tableNumber, cartItems, totalPrice } = req.body;

  try {
    // Step 1: Check if the table number is already taken by the same restaurant
    const [existingOrder] = await db.execute(
      `SELECT * FROM orders WHERE restaurant_id = ? AND table_number = ?`,
      [restaurantId, tableNumber]
    );

    if (existingOrder.length > 0) {
      // If an order already exists for this restaurant and table number, send an error
      return res.status(400).send({
        message:
          "This table number is already in use by this restaurant. Please choose another table.",
      });
    }

    // Step 2: If table is not taken by the same restaurant, allow order even if it is taken by another restaurant
    // Optionally, you can alert the user or show them a different table if desired
    const [existingOrderFromAnotherRestaurant] = await db.execute(
      `SELECT * FROM orders WHERE table_number = ?`,
      [tableNumber]
    );

    if (existingOrderFromAnotherRestaurant.length > 0) {
      console.log(
        "Table is already occupied by another restaurant. Proceeding with the order..."
      );
      // Here you could add an option to show a warning or allow changing the table
    }

    // Step 3: Save the main order in the `orders` table
    const orderId = await Order.createOrder(
      restaurantId,
      tableNumber,
      totalPrice
    );

    // Step 4: Prepare and save the order details in the `order_details` table
    const orderDetails = cartItems.map((item) => ({
      orderId,
      dishId: item.id,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    }));

    await OrderDetails.createOrderDetails(orderDetails);

    // Step 5: Also save order data in the `order_sales` table
    await db.execute(
      `INSERT INTO order_sales (order_id, restaurant_id, table_number, total_price) VALUES (?, ?, ?, ?)`,
      [orderId, restaurantId, tableNumber, totalPrice]
    );

    res.status(200).send({ message: "Order saved successfully" });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).send({
      message: "Failed to save order",
      error: "Failed to save order details in the database.",
    });
  }
};

module.exports = {
  saveOrder,
};
