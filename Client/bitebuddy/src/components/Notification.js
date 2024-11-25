import React, { useState } from "react";
import axios from "axios";
import "./Notification.css"; // Import the external CSS file

function Notification() {
  const [restaurantId, setRestaurantId] = useState(""); // To store the restaurant ID
  const [isVerified, setIsVerified] = useState(false); // To track verification status
  const [error, setError] = useState(""); // To handle error messages

  const verifyRestaurantId = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/verifyRestaurant",
        { restaurantId }
      );

      if (response.data.success) {
        setIsVerified(true);
        setError("");
      } else {
        setIsVerified(false);
        setError("Invalid restaurant ID. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying restaurant ID:", err);
      setError("Failed to verify ID. Please try again later.");
    }
  };

  return (
    <div className="notification-container">
      <h2>Verify Restaurant ID</h2>
      <div className="input-container">
        <label htmlFor="restaurantId" className="label">
          Enter Restaurant ID:
        </label>
        <input
          type="text"
          id="restaurantId"
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
          className="input"
        />
      </div>
      <button onClick={verifyRestaurantId} className="verify-button">
        Verify
      </button>

      {isVerified && (
        <div className="success-message">
          <strong>Restaurant ID verified successfully!</strong>
        </div>
      )}

      {error && (
        <div className="error-message">
          <strong>{error}</strong>
        </div>
      )}
    </div>
  );
}

export default Notification;
