import React, { useState } from "react";
import axios from "axios";
import "./Notification.css"; // Import the external CSS file

function Notification() {
  const [restaurantId, setRestaurantId] = useState(""); // To store the restaurant ID
  const [chefId, setChefId] = useState(""); // To store the chef's ID
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

  const handleMessageSend = () => {
    if (restaurantId === chefId) {
      // Allow message sending if IDs match
      alert("Hello! IDs match!");
    } else {
      setError("The Restaurant ID and Chef ID do not match.");
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

      <div className="input-container">
        <label htmlFor="chefId" className="label">
          Enter Chef ID:
        </label>
        <input
          type="text"
          id="chefId"
          value={chefId}
          onChange={(e) => setChefId(e.target.value)}
          className="input"
        />
      </div>

      <button onClick={verifyRestaurantId} className="verify-button">
        Verify Restaurant ID
      </button>

      <button onClick={handleMessageSend} className="send-message-button">
        Send Message to Notification
      </button>

      {isVerified && (
        <div className="success-message">
          <strong>Restaurant ID verified successfully!</strong>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default Notification;
