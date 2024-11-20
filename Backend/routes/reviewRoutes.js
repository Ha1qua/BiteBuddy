const express = require("express");
const { submitReviews } = require("../controllers/reviewController");

const router = express.Router();

// POST /api/food-reviews
router.post("/food-reviews", submitReviews);

module.exports = router;
