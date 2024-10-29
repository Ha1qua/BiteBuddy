import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RestaurantUser.css";

function RestaurantUser() {
  const [tableNumber, setTableNumber] = useState("");
  const [dishList, setDishList] = useState([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

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
    } else {
      alert("Invalid input. Enter a number from 1 to 15.");
    }
  };

  const handleOkClick = async () => {
    if (tableNumber) {
      try {
        await axios.post("http://localhost:5000/api/sessions/store-table", {
          tableNumber,
        });
        alert(`Table number ${tableNumber} entered!`);
        setTableNumber("");
      } catch (error) {
        console.error("Error storing table number:", error);
        alert("Failed to store table number.");
      }
    } else {
      alert("Please enter a table number.");
    }
  };

  const handleMenuClick = () => {
    setIsMenuVisible((prevState) => !prevState);
    setIsCartVisible(false);
  };

  const handleAddToCart = (dish) => {
    const existingItem = cartItems.find((item) => item.id === dish.id);
    if (existingItem) {
      alert(`${dish.dishName} is already in the cart.`);
    } else {
      setCartItems((prevItems) => [...prevItems, { ...dish, quantity: 1 }]);
      alert(`${dish.dishName} added to cart!`);
    }
  };

  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleCartClick = () => {
    setIsCartVisible((prevState) => !prevState);
    setIsMenuVisible(false);
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
        <button className="ok-button" onClick={handleOkClick}>
          OK
        </button>
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
                <p>Price: ${dish.price}</p>
                <button onClick={() => handleAddToCart(dish)}>
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
            cartItems.map((item, index) => (
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
                <p>Price: ${item.price}</p>
                <div className="quantity-control">
                  <button onClick={() => decreaseQuantity(item.id)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default RestaurantUser;
