import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Chef.css"; // Ensure to import your CSS file

const Chef = () => {
  const [restaurantId, setRestaurantId] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [orders, setOrders] = useState([]);
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
        setError(""); // Clear any error on successful verification

        // Load messages specific to the current restaurant ID
        const allMessages =
          JSON.parse(localStorage.getItem("chefMessages")) || [];
        const filteredMessages = allMessages.filter(
          (msg) => msg.restaurantId === restaurantId
        );
        setChefMessages(filteredMessages);
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
        tableNumber,
        message: statusMessage,
        timestamp: new Date().getTime(),
      };

      // Get existing messages for this restaurant ID
      const messages =
        JSON.parse(localStorage.getItem(`chefMessages_${restaurantId}`)) || [];

      // Find the index of the message for the selected table number
      const existingMessageIndex = messages.findIndex(
        (msg) => msg.tableNumber === tableNumber
      );

      if (existingMessageIndex !== -1) {
        // Update existing message
        messages[existingMessageIndex] = fullMessage;
      } else {
        // Add new message
        messages.push(fullMessage);
      }

      // Save updated messages to localStorage
      localStorage.setItem(
        `chefMessages_${restaurantId}`,
        JSON.stringify(messages)
      );

      // Update state
      setChefMessages(messages);

      // Clear inputs
      setTableNumber("");
      setStatusMessage("");
      setError(""); // Clear any previous errors
    } else {
      setError("Please select a table and status message.");
    }
  };

  // Function to clear messages individually after 1 minute
  useEffect(() => {
    const messageTimers = chefMessages.map((msg, index) => {
      const timeLeft = new Date().getTime() - msg.timestamp;
      const delay = 1 * 60 * 1000 - timeLeft;

      if (delay > 0) {
        return setTimeout(() => {
          setChefMessages((prevMessages) => {
            const updatedMessages = prevMessages.filter((_, i) => i !== index);
            localStorage.setItem(
              `chefMessages_${restaurantId}`,
              JSON.stringify(updatedMessages)
            );
            return updatedMessages;
          });
        }, delay);
      }
      return null;
    });

    return () => messageTimers.forEach((timer) => clearTimeout(timer));
  }, [chefMessages, restaurantId]);

  // Load messages from localStorage when the component mounts
  useEffect(() => {
    if (restaurantId) {
      const messages =
        JSON.parse(localStorage.getItem(`chefMessages_${restaurantId}`)) || [];
      setChefMessages(messages);
    }
  }, [restaurantId]);

  return (
    <div className="chef-container">
      {!isVerified ? (
        <div className="verify-restaurant">
          <h2>Enter Restaurant ID</h2>
          <input
            type="text"
            value={restaurantId}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setRestaurantId(value); // Update state only if the input is numeric
                setError(""); // Clear error if the input is valid
              } else {
                setError("Incorrect information");
              }
            }}
            placeholder="Restaurant ID"
          />

          <button onClick={verifyRestaurantId}>Verify</button>
          {error && <p className="error-message">{error}</p>}
        </div>
      ) : (
        <div className="dashboard">
          <h2 className="headingm">
            Your Kitchen at a Glance
            <br />
            Track, Manage, and Perfect Every Order
          </h2>
          <div className="chef-layout">
            {/* Orders Section */}
            <div className="chef-orders">
              <h3 className="headingd">Incoming Orders</h3>
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

            {/* Message Section */}
            <div className="send-message">
              <h3 className="headingd">Send Message to a Table</h3>
              <label className="lab">Table Number</label>
              <select
                className="s"
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

              <label className="lab">Status Message</label>
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

            {/* Chef Messages Section */}
            <div className="messages">
              <h3 className="headingd">Messages</h3>
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
