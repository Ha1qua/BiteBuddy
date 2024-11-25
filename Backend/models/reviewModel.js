const db = require("../services/db");

// Insert multiple reviews into the database
const addReviews = async (reviews, restaurantId) => {
  const query = `
    INSERT INTO food_reviews (food_name, review, rating, restaurant_id)
    VALUES ?`;
  const values = reviews.map((r) => [
    r.foodName,
    r.review,
    r.rating,
    restaurantId,
  ]);

  await db.query(query, [values]);
};

module.exports = { addReviews };
