const express = require("express");
const {
  addReview,
  fetchReviews,
} = require("../controllers/foodReviewController");

const router = express.Router();

// Route to add a new review
router.post("/", addReview);

// Route to get all reviews
router.get("/", fetchReviews);

module.exports = router;
