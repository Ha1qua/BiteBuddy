const { createReview, getAllReviews } = require("../models/foodReviewModel");

const addReview = async (req, res) => {
  const { reviews } = req.body;

  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return res.status(400).json({ message: "Reviews array is required!" });
  }

  const errors = [];
  const successes = [];

  await Promise.all(
    reviews.map(async ({ foodName, review }) => {
      if (!foodName || !review) {
        errors.push({
          foodName,
          message: "Food name and review are required!",
        });
        return;
      }

      try {
        await createReview(foodName, review);
        successes.push({ foodName, message: "Review added successfully!" });
      } catch (error) {
        console.error(`Error adding review for ${foodName}:`, error);
        errors.push({ foodName, message: "Error adding review!" });
      }
    })
  );

  if (errors.length > 0) {
    return res.status(207).json({ successes, errors });
  }

  res.status(201).json({ message: "All reviews added successfully!" });
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
