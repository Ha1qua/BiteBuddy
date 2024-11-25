import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Chef.css"; // Ensure to import your CSS file

const Chef = () => {
  const [restaurantId, setRestaurantId] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tableNumber, setTableNumber] = useState(""); // Table number state
  const [statusMessage, setStatusMessage] = useState(""); // Status message state
  const [chefMessages, setChefMessages] = useState([]); // To store chef messages

  const statusOptions = [
    "Order is confirmed.",
    "Order is in progress.",
    "Order will be ready in 15 minutes.",
    "Order is ready to deliver.",
  ];

  // Function to verify restaurant ID
  const verifyRestaurantId = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/verifyRestaurant",
        { restaurantId }
      );
      if (response.data.success) {
        setIsVerified(true);
        fetchOrders();
      } else {
        setError("Invalid restaurant ID. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying restaurant ID:", err);
      setError("Failed to verify ID. Please try again later.");
    }
  };

  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chef/orders?restaurantId=${restaurantId}`
      );
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again later.");
    }
  };

  // Function to send a message
  const sendMessage = () => {
    if (tableNumber && statusMessage.trim()) {
      const fullMessage = {
        restaurantId, // Include the restaurant ID
        tableNumber,
        message: statusMessage,
        timestamp: new Date().getTime(), // Store timestamp as a number (milliseconds)
      };

      // Get messages from localStorage
      const messages = JSON.parse(localStorage.getItem("chefMessages")) || [];

      // Find the index of the message for the selected table number
      const existingMessageIndex = messages.findIndex(
        (msg) =>
          msg.tableNumber === tableNumber && msg.restaurantId === restaurantId
      );

      if (existingMessageIndex !== -1) {
        // If a message exists for that table and restaurant ID, update it
        messages[existingMessageIndex] = fullMessage;
      } else {
        // If no message exists for that table and restaurant ID, add the new message
        messages.push(fullMessage);
      }

      // Save the updated list of messages to localStorage
      localStorage.setItem("chefMessages", JSON.stringify(messages));

      // Update the state with the new list of messages
      setChefMessages(messages);

      // Clear the input fields
      setMessage("");
      setTableNumber("");
      setStatusMessage("");
    } else {
      setError("Please select a table and status message.");
    }
  };

  // Function to clear expired messages (older than 1 minute)
  const clearExpiredMessages = () => {
    const currentTime = new Date().getTime();

    // Filter out messages older than 1 minute (60 * 1000 ms)
    const validMessages = chefMessages.filter((msg) => {
      return currentTime - msg.timestamp < 1 * 60 * 1000; // 1 minute in milliseconds
    });

    // Update the state and localStorage
    setChefMessages(validMessages);
    localStorage.setItem("chefMessages", JSON.stringify(validMessages));
  };

  // Set an interval to clear messages every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      clearExpiredMessages();
    }, 60000); // 60000ms = 1 minute

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [chefMessages]); // Run this effect whenever chefMessages change

  // Load messages from localStorage when the component mounts
  useEffect(() => {
    const messages = JSON.parse(localStorage.getItem("chefMessages")) || [];
    setChefMessages(messages);
  }, []);

  return (
    <div className="chef-container">
      {!isVerified ? (
        <div className="verify-restaurant">
          <h2>Enter Restaurant ID</h2>
          <input
            type="text"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            placeholder="Restaurant ID"
          />
          <button onClick={verifyRestaurantId}>Verify</button>
          {error && <p className="error-message">{error}</p>}
        </div>
      ) : (
        <div className="dashboard">
          <h2>Chef Dashboard</h2>
          <p>
            Restaurant ID: <strong>{restaurantId}</strong>
          </p>
          <div className="chef-layout">
            {/* Orders Section (Left side) */}
            <div className="chef-orders">
              <h3>Incoming Orders</h3>
              {orders.length === 0 ? (
                <p>No orders available.</p>
              ) : (
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Table</th>
                      <th>Dish</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={index}>
                        <td>{order.table_number}</td>
                        <td>{order.dishName}</td>
                        <td>{order.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Message Section (Middle) */}
            <div className="send-message">
              <h3>Send Message to a Table</h3>

              <label>Table Number</label>
              <select
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              >
                <option value="">Select Table</option>
                {[...Array(15)].map((_, index) => (
                  <option key={index} value={index + 1}>
                    Table {index + 1}
                  </option>
                ))}
              </select>

              <label>Status Message</label>
              <select
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
              >
                <option value="">Select Message</option>
                {statusOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <button onClick={sendMessage}>Send Message</button>
            </div>

            {/* Chef Messages Section (Right side) */}
            <div className="messages">
              <h3>Messages</h3>
              {chefMessages.length === 0 ? (
                <p>No messages available.</p>
              ) : (
                <div>
                  {chefMessages.map((msg, index) => (
                    <div key={index} className="message">
                      <strong>Table {msg.tableNumber}</strong>: {msg.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chef;
