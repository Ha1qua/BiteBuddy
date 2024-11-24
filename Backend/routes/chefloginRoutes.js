const express = require("express");
const { verifyRestaurantId } = require("../controllers/chefloginController");

const router = express.Router();

router.post("/verifyRestaurant", verifyRestaurantId);

module.exports = router;
