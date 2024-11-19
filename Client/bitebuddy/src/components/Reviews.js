import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
// import "./Review.css";

function Review() {
  const location = useLocation();
  const foodNames = location.state?.foodNames || [];
  const [reviews, setReviews] = useState(
    foodNames.map((food) => ({ foodName: food, review: "" }))
  );

  const handleReviewChange = (index, value) => {
    setReviews((prevReviews) =>
      prevReviews.map((item, i) =>
        i === index ? { ...item, review: value } : item
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/reviews", {
        reviews,
      });
      if (response.status === 200) {
        alert("Reviews submitted successfully!");
      } else {
        alert("Failed to submit reviews.");
      }
    } catch (error) {
      console.error("Error submitting reviews:", error);
      alert("An error occurred while submitting reviews.");
    }
  };

  return (
    <div className="review-container">
      <h1>Write Reviews</h1>
      {reviews.map((item, index) => (
        <div key={index} className="review-item">
          <h3>{item.foodName}</h3>
          <textarea
            placeholder="Write your review here"
            value={item.review}
            onChange={(e) => handleReviewChange(index, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Reviews</button>
    </div>
  );
}

export default Review;
