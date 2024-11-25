import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import "./Message.css";

const Message = () => {
  const [chefMessages, setChefMessages] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");
  const location = useLocation(); // Hook to access location and state passed during navigation
  const navigate = useNavigate(); // Hook for navigation

  // Retrieve foodNames and restaurantId from location.state
  const { foodNames = [], restaurantId: locationRestaurantId } =
    location.state || {};
  const id = locationRestaurantId || "Unknown Restaurant"; // Use restaurantId passed from state

  useEffect(() => {
    // Load restaurant ID from localStorage (or another source)
    setRestaurantId(id);

    // Function to filter and update messages
    const updateMessages = () => {
      const messages = JSON.parse(localStorage.getItem("chefMessages")) || [];
      const validMessages = messages.filter(
        (msg) =>
          msg.tableNumber &&
          msg.message &&
          msg.timestamp &&
          msg.restaurantId === id // Only match messages with the same restaurantId
      );
      setChefMessages(validMessages);
    };

    // Load initial messages
    updateMessages();

    // Set up an interval to poll for new messages
    const interval = setInterval(updateMessages, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [id]);

  // Handler for navigation to the review page
  const handleNavigateToReview = () => {
    navigate("/review", { state: { foodNames } });
  };

  return (
    <div className="message-container">
      <h1>Quick update on your delicious order!</h1>
      {/* <h2>Restaurant ID: {restaurantId}</h2> */}
      {chefMessages.length === 0 ? (
        <p className="linechef">No messages from the chef yet.</p>
      ) : (
        <ul>
          {chefMessages.map((message, index) => {
            return (
              <li key={index} className="message-item">
                <p className="tablemsg">
                  <strong>Table {message.tableNumber}:</strong>{" "}
                  {message.message}
                  <small className="timestamp">
                    {new Date(message.timestamp).toLocaleString()}
                  </small>
                </p>
              </li>
            );
          })}
        </ul>
      )}

      {/* Display food names */}
      {foodNames.length > 0 && (
        <div>
          <h3>Your order includes:</h3>
          <ul>
            {foodNames.map((foodName, index) => (
              <li key={index}>{foodName}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Button to navigate to the review page */}
      <button onClick={handleNavigateToReview} className="review-button">
        Go to Review
      </button>
    </div>
  );
};

export default Message;
