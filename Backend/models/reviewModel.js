const db = require("../services/db");

// Insert multiple reviews into the database
const addReviews = async (reviews) => {
  const query = `
    INSERT INTO food_reviews (food_name, review, rating)
    VALUES ?`;
  const values = reviews.map((r) => [r.foodName, r.review, r.rating]);

  await db.query(query, [values]);
};

module.exports = { addReviews };
