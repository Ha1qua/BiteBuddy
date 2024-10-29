const express = require("express");
const router = express.Router();
const dishController = require("../controllers/dishController");

// Route to create a new dish
router.post("/", dishController.createDish);

// Route to get dishes by restaurant ID
router.get("/:restaurantId", dishController.fetchDishesByRestaurant);

// Route to delete a dish by ID
router.delete("/:id", dishController.deleteDish);

// Route to update a dish by ID
router.put("/:id", dishController.updateDish);

module.exports = router;
