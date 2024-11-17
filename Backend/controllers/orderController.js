const Order = require("../models/orderModel");
const OrderDetails = require("../models/orderDetailModel");

const saveOrder = async (req, res) => {
  const { restaurantId, tableNumber, cartItems, totalPrice } = req.body;

  try {
    // Step 1: Save the main order
    const orderId = await Order.createOrder(
      restaurantId,
      tableNumber,
      totalPrice
    );

    // Step 2: Prepare and save the order details
    const orderDetails = cartItems.map((item) => ({
      orderId,
      dishId: item.id,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    }));

    await OrderDetails.createOrderDetails(orderDetails);

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
