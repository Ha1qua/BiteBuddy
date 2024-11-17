import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Chef.css"; // Custom CSS for Chef page

function Chef() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch orders for the chef from the backend
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/chef/orders"
        );
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="chef-container">
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
    </div>
  );
}

export default Chef;
