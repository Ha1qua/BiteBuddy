const express = require("express");
const router = express.Router();
const { getOrdersForChef } = require("../controllers/chefController");

// Route to fetch all orders for the chef
router.get("/orders", getOrdersForChef);

module.exports = router;
