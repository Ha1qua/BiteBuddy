import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./RestaurantUser.css";

function RestaurantUser() {
  const [tableNumber, setTableNumber] = useState("");
  const [dishList, setDishList] = useState([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function for redirection

  useEffect(() => {
    const restaurantId = localStorage.getItem("restaurantId");
    if (restaurantId) {
      fetchDishes(restaurantId);
    } else {
      alert("Restaurant ID not found. Please log in again.");
    }
  }, []);

  const fetchDishes = async (restaurantId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/dishes/${restaurantId}`
      );
      setDishList(response.data);
    } catch (error) {
      console.error("Error fetching dishes:", error);
      alert("Failed to load menu.");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[1-9]$|^1[0-5]$/.test(value)) {
      setTableNumber(value);
      setErrorMessage(""); // Clear error message if input is valid
    } else {
      setErrorMessage("Invalid input. Enter a number from 1 to 15.");
    }
  };

  const handleMenuClick = () => {
    setIsMenuVisible((prevState) => !prevState);
    setIsCartVisible(false);
  };

  const handleAddToCart = (dish) => {
    const existingItem = cartItems.find((item) => item.id === dish.id);
    if (!existingItem) {
      const price = parseFloat(dish.price);
      setCartItems((prevItems) => [
        ...prevItems,
        { ...dish, quantity: 1, totalPrice: price },
      ]);
      // Automatically go to the cart after adding item
      setIsCartVisible(true);
      setIsMenuVisible(false); // Close the menu when going to the cart
    }
  };

  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: item.price * (item.quantity + 1),
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
              totalPrice: item.price * (item.quantity - 1),
            }
          : item
      )
    );
  };

  const handleCartClick = () => {
    setIsCartVisible((prevState) => !prevState);
    setIsMenuVisible(false);
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + parseFloat(item.totalPrice),
      0
    );
  };

  const confirmOrder = async () => {
    // Step 1: Check if table number is provided
    if (!tableNumber) {
      setErrorMessage("Table number is required to confirm the order.");
      return;
    }

    try {
      // Step 2: Retrieve restaurantId and prepare the orderData
      const restaurantId = localStorage.getItem("restaurantId"); // Retrieve the restaurant ID
      console.log("Restaurant ID:", restaurantId); // Log restaurant ID to ensure it's correct

      // Check if localStorage item is valid
      if (!restaurantId) {
        console.error("Restaurant ID not found in localStorage.");
        alert("Restaurant ID is missing.");
        return;
      }

      // Prepare the order data
      const orderData = {
        restaurantId,
        tableNumber,
        cartItems,
        totalPrice: calculateTotalPrice(),
      };

      // Log the order data to verify
      console.log("Order data to send:", orderData);

      // Step 3: Send the POST request
      const response = await axios.post(
        "http://localhost:5000/api/orders/saveOrder",
        orderData
      );

      // Step 4: Check the response status
      if (response.status === 200) {
        console.log("Order confirmed and saved:", response.data);
        navigate("/message"); // Redirect to message page
        setCartItems([]); // Clear the cart after order is saved
      } else {
        console.error(
          "Failed to confirm the orderwala. Response status:",
          response.status
        );
        alert("Failed to confirm the order.haiqua");
      }
    } catch (error) {
      // Step 5: Catch any errors and log detailed information
      console.error("Error confirming order:", error);

      // Check if error.response exists (for server-side errors)
      if (error.response) {
        console.error("Error response from server:", error.response);
        alert(
          `Failed to confirm the orderfahasd. Server responded with: ${error.response.status}`
        );
      } else if (error.request) {
        console.error("No response received from server:", error.request);
        alert("No response from the server. Please try again later.");
      } else {
        console.error("Error in setting up the request:", error.message);
        alert("Failed to confirm the order. Please try again.");
      }
    }
  };

  return (
    <div className="restaurant-user-container">
      <h1>Welcome to the Restaurant User Page!</h1>

      <div className="button-row">
        <button className="menu-button" onClick={handleMenuClick}>
          Menu
        </button>
        <button className="view-cart-button" onClick={handleCartClick}>
          View Cart
        </button>

        <input
          type="text"
          placeholder="Enter Table Number"
          className="table-number-input"
          value={tableNumber}
          onChange={handleInputChange}
        />
        {errorMessage && (
          <p className="error-message" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}
      </div>

      {isMenuVisible && (
        <div className="dish-list">
          {dishList.length === 0 ? (
            <p>No dishes available at the moment.</p>
          ) : (
            dishList.map((dish) => (
              <div key={dish.id} className="dish-item">
                <img
                  src={dish.image}
                  alt={dish.dishName}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-dish.jpg";
                  }}
                  className="dish-image"
                />
                <h2>{dish.dishName}</h2>
                <p>Price: Rs {parseFloat(dish.price).toFixed(2)}</p>
                <button className="cartb" onClick={() => handleAddToCart(dish)}>
                  Add to Cart
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {isCartVisible && (
        <div className="cart-items">
          <h2>Cart Items</h2>
          {cartItems.length === 0 ? (
            <p>No items in the cart.</p>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <h3>{item.dishName}</h3>
                  <img
                    src={item.image}
                    alt={item.dishName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-dish.jpg";
                    }}
                    className="cart-image"
                  />
                  <p>Price: Rs {parseFloat(item.price).toFixed(2)}</p>
                  <div className="quantity-control">
                    <button onClick={() => decreaseQuantity(item.id)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>
                  <br />
                  <p>Total: Rs {parseFloat(item.totalPrice).toFixed(2)}</p>
                  <button
                    className="delete-button"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
              <div className="total-price">
                <h3>Subtotal: Rs {calculateTotalPrice().toFixed(2)}</h3>
                <p>If you want to order more, go to the menu.</p>
              </div>
              <button className="confirm-order-button" onClick={confirmOrder}>
                Confirm Order
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default RestaurantUser;
