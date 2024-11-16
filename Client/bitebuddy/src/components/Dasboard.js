import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [dishList, setDishList] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [dishToUpdate, setDishToUpdate] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [newDish, setNewDish] = useState({
    dishName: "",
    price: "",
    ingredients: "",
    imageUrl: "",
    restaurant_id: "",
  });

  const [errors, setErrors] = useState({
    dishName: "",
    ingredients: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("restaurantId");
    if (id) {
      setRestaurantId(id);
      fetchDishes(id);
      setNewDish((prev) => ({ ...prev, restaurant_id: id }));
      fetchRestaurantName(id);
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
    }
  };

  const fetchRestaurantName = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/dishes/${id}`);
      const data = response.data;
      setRestaurantName(data.name);
    } catch (error) {
      console.error("Error fetching restaurant name:", error);
    }
  };

  const handleFormToggle = () => {
    setIsFormOpen((prev) => !prev);
    setDishToUpdate(null);
  };

  const handleDeleteModeToggle = () => setIsDeleteMode((prev) => !prev);
  const handleUpdateModeToggle = () => setIsUpdateMode((prev) => !prev);

  const handleCheckboxChange = (dishId) => {
    setSelectedDishes((prev) =>
      prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId]
    );
  };

  const handleDeleteDishes = async () => {
    const confirmDelete = window.confirm(
      "This will delete the selected dishes. Are you sure?"
    );
    if (!confirmDelete) return;

    try {
      await Promise.all(
        selectedDishes.map((dishId) =>
          axios.delete(`http://localhost:5000/dishes/${dishId}`)
        )
      );
      setSelectedDishes([]);
      fetchDishes(restaurantId);
    } catch (error) {
      console.error("Error deleting dishes:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDish((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditDish = (dish) => {
    setDishToUpdate(dish);
    setNewDish({
      dishName: dish.dishName,
      price: dish.price,
      ingredients: dish.ingredients,
      imageUrl: dish.image,
      restaurant_id: restaurantId,
    });
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    const dishNamePattern = /^[A-Za-z_]+$/;
    const ingredientsPattern = /^[A-Za-z\s,]+$/;

    if (!dishNamePattern.test(newDish.dishName)) {
      errors.dishName = "Dish name must contain only letters and underscores.";
    }
    if (!ingredientsPattern.test(newDish.ingredients)) {
      errors.ingredients =
        "Ingredients must contain only letters, spaces, and commas.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddDish = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (dishToUpdate) {
        await axios.put(
          `http://localhost:5000/dishes/${dishToUpdate.id}`,
          newDish
        );
      } else {
        await axios.post("http://localhost:5000/dishes", newDish);
      }

      setNewDish({
        dishName: "",
        price: "",
        ingredients: "",
        imageUrl: "",
        restaurant_id: restaurantId,
      });

      // Fetch updated list of dishes
      fetchDishes(restaurantId);

      // Close the form
      setIsFormOpen(false);
      setDishToUpdate(null);
    } catch (error) {
      console.error("Error adding/updating dish:", error);
    }
  };

  const handleUserLogin = () => {
    navigate("/restaurant-user");
  };

  return (
    <div className="dashboard-container">
      <h1 className="dasbhead">
        Glad to see you {restaurantName}! Manage everything from here
      </h1>

      <div className="button-box">
        <button onClick={handleFormToggle}>
          {isFormOpen ? "Close Form" : "Add Menu"}
        </button>
        <button onClick={handleDeleteModeToggle}>
          {isDeleteMode ? "Cancel" : "Remove Menu"}
        </button>
        <button onClick={handleUpdateModeToggle}>
          {isUpdateMode ? "Cancel Update" : "Update Menu"}
        </button>
        <button onClick={handleUserLogin}>Login for User</button>
      </div>

      {isFormOpen && (
        <form className="dish-form" onSubmit={handleAddDish}>
          <label>
            Dish Name:
            <input
              type="text"
              name="dishName"
              value={newDish.dishName}
              onChange={handleChange}
              required
            />
          </label>
          {errors.dishName && <p className="error">{errors.dishName}</p>}
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={newDish.price}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Ingredients:
            <textarea
              name="ingredients"
              value={newDish.ingredients}
              onChange={handleChange}
              required
            />
          </label>
          {errors.ingredients && <p className="error">{errors.ingredients}</p>}
          <label>
            Image URL:
            <input
              type="text"
              name="imageUrl"
              value={newDish.imageUrl}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Restaurant ID:
            <input
              type="text"
              name="restaurant_id"
              value={newDish.restaurant_id}
              readOnly
            />
          </label>
          <button type="submit" className="add">
            {dishToUpdate ? "Update Dish" : "Add Dish"}
          </button>
        </form>
      )}

      <div className="dish-list">
        {dishList.map((dish) => (
          <div key={dish.id} className="dish-item">
            {isDeleteMode && (
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(dish.id)}
                checked={selectedDishes.includes(dish.id)}
              />
            )}
            <img
              src={dish.image}
              alt={dish.dishName}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-dish.jpg";
              }}
            />
            <div className="a">
              <h2>{dish.dishName}</h2>
              <p>Price: Rs {dish.price}</p>
              <p>Ingredients: {dish.ingredients}</p>
              {isUpdateMode && (
                <button className="edit" onClick={() => handleEditDish(dish)}>
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isDeleteMode && selectedDishes.length > 0 && (
        <button className="del" onClick={handleDeleteDishes}>
          Delete Selected Dishes
        </button>
      )}
    </div>
  );
}

export default Dashboard;
