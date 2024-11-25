import React, { useEffect, useState } from "react";

const Message = () => {
  const [chefMessages, setChefMessages] = useState([]);

  useEffect(() => {
    // Load initial messages from localStorage
    const messages = JSON.parse(localStorage.getItem("chefMessages")) || [];

    // Filter out invalid messages (empty fields)
    const validMessages = messages.filter(
      (msg) => msg.tableNumber && msg.message && msg.timestamp
    );

    setChefMessages(validMessages);

    // Listen for changes in localStorage
    const handleStorageChange = () => {
      const updatedMessages =
        JSON.parse(localStorage.getItem("chefMessages")) || [];
      // Filter again when messages are updated
      const validUpdatedMessages = updatedMessages.filter(
        (msg) => msg.tableNumber && msg.message && msg.timestamp
      );
      setChefMessages(validUpdatedMessages);
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div>
      <h2>Messages</h2>
      {chefMessages.length > 0 ? (
        <ul>
          {chefMessages.map((msg, index) => (
            <li key={index}>
              <strong>Table {msg.tableNumber}:</strong> {msg.message} -{" "}
              {msg.timestamp && new Date(msg.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No messages yet.</p>
      )}
    </div>
  );
};

export default Message;
