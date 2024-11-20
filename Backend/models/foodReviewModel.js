const db = require("../services/db");

// Create a new review
const createReview = (foodName, review) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO food_reviews (food_name, review) VALUES (?, ?)";
    db.query(query, [foodName, review], (err, result) => {
      if (err) {
        console.error(`Error inserting review for ${foodName}:`, err);
        return reject(err);
      }
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
