import React, { useEffect, useState } from "react";
import "./Message.css";
const Message = () => {
  const [chefMessages, setChefMessages] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");

  useEffect(() => {
    // Load restaurant ID from localStorage (or another source)
    const id = localStorage.getItem("restaurantId") || "Unknown Restaurant";
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
  }, []);

  return (
    <div className="message-container">
      <h1>Quick update on your delicious order!</h1>
      {/* <h2>Restaurant ID: {restaurantId}</h2> Display the restaurant ID */}
      {chefMessages.length === 0 ? (
        <p className="linechef">No messages from the chef yet.</p>
      ) : (
        <ul>
          {chefMessages.map((message, index) => {
            // console.log("Haiqua", message.id); // Log "Haiqua" and the message ID
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
    </div>
  );
};

export default Message;
