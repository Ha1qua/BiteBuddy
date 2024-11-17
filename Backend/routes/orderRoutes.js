const express = require("express");
const router = express.Router();
const { saveOrder } = require("../controllers/orderController");

// Route to save an order
router.post("/saveOrder", saveOrder);

module.exports = router;
