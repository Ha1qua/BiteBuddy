import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Review.css"; // Import your regular CSS file

function Review() {
  const navigate = useNavigate();
  const location = useLocation();
  const foodNames = location.state?.foodNames || [];
  const [reviews, setReviews] = useState(
    foodNames.map((food) => ({ foodName: food, review: "", rating: 1 }))
  );
  const [loading, setLoading] = useState(false);

  // Update the state when a review or rating changes
  const handleReviewChange = (index, field, value) => {
    setReviews((prevReviews) =>
      prevReviews.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  // Validate and submit the reviews
  const handleSubmit = async () => {
    const invalidReviews = reviews.filter(
      (item) =>
        !item.review.trim() ||
        item.rating < 1 ||
        item.rating > 10 ||
        !item.rating
    );

    if (invalidReviews.length > 0) {
      alert(
        "All reviews must have valid text, and ratings must be between 1 and 10."
      );
      return;
    }

    setLoading(true); // Show loading spinner

    try {
      const response = await axios.post(
        "http://localhost:5000/api/food-reviews",
        { reviews }
      );

      if (response.status === 201) {
        alert("Reviews submitted successfully!");
        setReviews(
          foodNames.map((food) => ({ foodName: food, review: "", rating: 1 }))
        ); // Reset reviews
        navigate("/");
      } else {
        alert("Failed to submit reviews.");
      }
    } catch (error) {
      console.error("Error submitting reviews:", error);
      alert("An error occurred while submitting reviews.");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="review-container">
      <h1 className="rhead">Your Voice is Important to Us</h1>
      <h2 className="review-heading">Leave a Review!</h2>
      {reviews.map((item, index) => (
        <div key={index} className="review-item">
          <h3>{item.foodName}</h3>
          <textarea
            placeholder="Write your review here"
            value={item.review}
            onChange={(e) =>
              handleReviewChange(index, "review", e.target.value)
            }
          />
          <label className="label">
            Rating (1-10):
            <input
              type="number"
              min="1"
              max="10"
              value={item.rating}
              onChange={(e) =>
                handleReviewChange(
                  index,
                  "rating",
                  parseInt(e.target.value, 10)
                )
              }
            />
          </label>
        </div>
      ))}
      <button
        className="review-button"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Reviews"}
      </button>
    </div>
  );
}

export default Review;
