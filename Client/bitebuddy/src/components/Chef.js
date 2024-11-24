import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Chef.css"; // Custom CSS for Chef page

function Chef() {
  const [restaurantId, setRestaurantId] = useState(""); // State for restaurant ID input
  const [isVerified, setIsVerified] = useState(false); // State to check if the ID is valid
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  // Function to verify the restaurant ID
  const verifyRestaurantId = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/verifyRestaurant", // Endpoint for verification
        { restaurantId }
      );
      if (response.data.success) {
        setIsVerified(true);
        fetchOrders(); // Fetch orders if verified
      } else {
        setError("Invalid restaurant ID. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying restaurant ID:", err);
      setError("Failed to verify ID. Please try again later.");
    }
  };

  // Fetch orders for the chef from the backend
  // Fetch orders for the chef from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chef/orders?restaurantId=${restaurantId}` // Include restaurantId as query parameter
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
        // Show input for restaurant ID if not verified
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
        // Show orders and messages if verified
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
          <div className="chef-messages">
            <h2>Chef Messages</h2>
            <div className="messages">
              <p>
                <strong>Chef:</strong> Orders are being prepared. Stay tuned!
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Chef;
