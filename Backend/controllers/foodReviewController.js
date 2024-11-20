const { createReview, getAllReviews } = require("../models/foodReviewModel");

const addReview = async (req, res) => {
  const { reviews } = req.body;

  // Validation
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return res.status(400).json({ message: "Reviews array is required!" });
  }

  for (const { foodName, review, rating } of reviews) {
    if (!foodName || !review) {
      return res
        .status(400)
        .json({ message: "Food name and review are required!" });
    }
    if (typeof rating !== "number" || rating < 1 || rating > 10) {
      return res.status(400).json({
        message: `Rating for ${foodName} must be a number between 1 and 10!`,
      });
    }
  }

  try {
    // Insert all reviews concurrently using Promise.all
    await Promise.all(
      reviews.map(({ foodName, review, rating }) =>
        createReview(foodName, review, rating)
      )
    );

    res.status(201).json({ message: "Reviews added successfully!" });
  } catch (error) {
    console.error("Error adding reviews:", error);
    res.status(500).json({ message: "Error adding reviews!" });
  }
};

const fetchReviews = async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews!" });
  }
};

module.exports = {
  addReview,
  fetchReviews,
};
