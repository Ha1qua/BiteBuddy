import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Review.css"; // Import your regular CSS file

function Review() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]); // Track errors for each review
  const [submitMessage, setSubmitMessage] = useState(""); // Message after submit
  const navigate = useNavigate();
  const location = useLocation();
  const foodNames = location.state?.foodNames || [];
  const restaurantId = location.state?.restaurantId || ""; // Retrieve restaurantId from state

  // Initialize reviews state based on food names
  React.useEffect(() => {
    setReviews(
      foodNames.map((food) => ({ foodName: food, review: "", rating: 1 }))
    );
  }, [foodNames]);

  // Update the state when a review or rating changes
  const handleReviewChange = (index, field, value) => {
    setReviews((prevReviews) =>
      prevReviews.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  // Validate reviews and submit
  const handleSubmit = async () => {
    // Check for empty reviews and invalid ratings
    const newErrors = reviews.map((item) => {
      return {
        reviewError: !item.review.trim(),
        ratingError: item.rating < 1 || item.rating > 10 || !item.rating,
      };
    });

    // If there are any empty reviews or invalid ratings, don't submit
    if (newErrors.some((error) => error.reviewError || error.ratingError)) {
      setErrors(newErrors);
      setSubmitMessage(""); // Clear any previous messages
      return; // Stop the form submission
    }

    setErrors([]); // Clear any previous errors
    setLoading(true); // Show loading spinner
    setSubmitMessage(""); // Clear previous submit messages

    try {
      const response = await axios.post(
        "http://localhost:5000/api/food-reviews", // Your API endpoint
        { reviews, restaurantId } // Include restaurantId here
      );

      if (response.status === 201) {
        setSubmitMessage("Reviews submitted successfully!");
        setReviews(
          foodNames.map((food) => ({ foodName: food, review: "", rating: 1 }))
        ); // Reset reviews
        setTimeout(() => {
          navigate("/"); // Redirect to the home page after a short delay
        }, 1500);
      } else {
        setSubmitMessage("Failed to submit reviews. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting reviews:", error);
      setSubmitMessage("An error occurred while submitting reviews.");
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
          {/* Display error message below the text box if review is empty */}
          {errors[index]?.reviewError && (
            <div style={{ color: "red", marginTop: "5px" }}>
              Review cannot be empty.
            </div>
          )}
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
          {/* Display error message for invalid rating */}
          {errors[index]?.ratingError && (
            <div style={{ color: "red", marginTop: "5px" }}>
              Rating must be between 1 and 10.
            </div>
          )}
        </div>
      ))}
      <button
        className="review-button"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Reviews"}
      </button>

      {/* Display success or error message */}
      {submitMessage && (
        <div
          style={{
            marginTop: "20px",
            marginLeft: "165px",
            fontWeight: "bold",
            color: submitMessage.includes("successfully") ? "black" : "red",
          }}
        >
          {submitMessage}
        </div>
      )}
    </div>
  );
}

export default Review;
