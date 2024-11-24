import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Chef.css";

function Chef() {
  const [restaurantId, setRestaurantId] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [chefMessages, setChefMessages] = useState([]); // State to hold chef messages
  const [selectedTable, setSelectedTable] = useState(""); // State for selected table number
  const [selectedMessage, setSelectedMessage] = useState(""); // State for selected message

  // List of predefined messages
  const messageOptions = [
    "Order is confirmed.",
    "Order is in progress.",
    "Order will be ready in 15 minutes.",
    "Order is ready to deliver.",
  ];

  // Send message to the chat component
  const sendMessageToChat = (message, tableNumber) => {
    setChefMessages((prevMessages) => [
      ...prevMessages,
      { tableNumber, message, timestamp: new Date() },
    ]);
  };

  // Handle message sending
  const handleSendMessage = () => {
    if (!selectedTable || !selectedMessage) {
      setError("Please select a table and a message.");
      return;
    }
    sendMessageToChat(selectedMessage, selectedTable);
    setError(""); // Clear error if message is sent
  };

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

  return (
    <div className="chef-container">
      {!isVerified ? (
        <div className="verify-restaurant">
          <h2>Enter Your Restaurant ID</h2>
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
        <>
          <div className="chef-orders">
            <h2>Incoming Orders</h2>
            {error ? (
              <p className="error-message">{error}</p>
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

          {/* Message Selection Section */}
          <div className="send-message">
            <h2>Send Message to a Table</h2>
            <div>
              <label>Select Table Number:</label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
              >
                <option value="">Choose Table</option>
                {[...Array(15).keys()].map((table) => (
                  <option key={table} value={table + 1}>
                    Table {table + 1}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Select Message:</label>
              <select
                value={selectedMessage}
                onChange={(e) => setSelectedMessage(e.target.value)}
              >
                <option value="">Choose Message</option>
                {messageOptions.map((message, index) => (
                  <option key={index} value={message}>
                    {message}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleSendMessage}>Send Message</button>
            {error && <p className="error-message">{error}</p>}
          </div>

          {/* Messages Section */}
          <div className="messages">
            <h2>Chef Messages</h2>
            {chefMessages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              chefMessages.map((message, index) => (
                <div className="message" key={index}>
                  <p>
                    <strong>Table {message.tableNumber}:</strong>{" "}
                    {message.message}
                  </p>
                  <small>{message.timestamp.toLocaleString()}</small>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Chef;
