const express = require("express");
const router = express.Router();
const { getOrdersForChef } = require("../controllers/chefController");

// Route to fetch all orders for a specific restaurant ID
router.get("/orders", getOrdersForChef);

module.exports = router;
