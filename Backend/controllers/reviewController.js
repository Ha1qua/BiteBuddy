const { addReviews } = require("../models/reviewModel");

// Add reviews to the database
const submitReviews = async (req, res) => {
  try {
    const { reviews } = req.body;

    // Validation to ensure reviews exist and are well-formed
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return res.status(400).json({ message: "Invalid reviews data." });
    }

    await addReviews(reviews);

    res.status(201).json({ message: "Reviews added successfully!" });
  } catch (error) {
    console.error("Error adding reviews:", error);
    res.status(500).json({ message: "Failed to add reviews." });
  }
};

module.exports = { submitReviews };
