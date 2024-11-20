const db = require("../services/db");

// Create a new review
const createReview = (foodName, review, rating) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO food_reviews (food_name, review, rating) VALUES (?, ?, ?)";
    db.query(query, [foodName, review, rating], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Fetch all reviews
const getAllReviews = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM food_reviews ORDER BY created_at DESC";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching reviews:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

module.exports = {
  createReview,
  getAllReviews,
};
