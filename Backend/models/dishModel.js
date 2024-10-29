const pool = require("../services/db"); // Import the database connection pool

// Function to add a new dish
const addDish = async (dish) => {
  const { dishName, price, ingredients, image, restaurant_id } = dish;

  if (!dishName || !price || !ingredients || !restaurant_id) {
    throw new Error("Missing required fields");
  }

  const query = `
    INSERT INTO dishes (dishName, price, ingredients, image, restaurant_id) 
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await pool.execute(query, [
      dishName,
      price,
      ingredients,
      image,
      restaurant_id,
    ]);
    return result.insertId;
  } catch (error) {
    console.error("Error inserting dish:", error);
    throw new Error("Database error: Could not add the dish");
  }
};

// Function to get dishes by restaurant ID
const getDishesByRestaurantId = async (restaurantId) => {
  if (!restaurantId) {
    throw new Error("Restaurant ID is required");
  }

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM dishes WHERE restaurant_id = ?",
      [restaurantId]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching dishes:", error);
    throw new Error("Database error: Could not retrieve dishes");
  }
};

// Function to delete a dish by ID
const deleteDishById = async (dishId) => {
  const query = "DELETE FROM dishes WHERE id = ?";

  try {
    const [result] = await pool.execute(query, [dishId]);
    if (result.affectedRows === 0) {
      throw new Error("Dish not found");
    }
    return { message: "Dish deleted successfully" };
  } catch (error) {
    console.error("Error deleting dish:", error);
    throw new Error("Database error: Could not delete dish");
  }
};

// Function to update a dish by ID
const updateDishById = async (dishId, dish) => {
  const { dishName, price, ingredients, image, restaurant_id } = dish;

  if (!dishName && !price && !ingredients && !image && !restaurant_id) {
    throw new Error("At least one field is required to update");
  }

  const updates = [];
  const values = [];

  if (dishName) {
    updates.push("dishName = ?");
    values.push(dishName);
  }
  if (price) {
    updates.push("price = ?");
    values.push(price);
  }
  if (ingredients) {
    updates.push("ingredients = ?");
    values.push(ingredients);
  }
  if (image) {
    updates.push("image = ?");
    values.push(image);
  }
  if (restaurant_id) {
    updates.push("restaurant_id = ?");
    values.push(restaurant_id);
  }

  values.push(dishId);

  const query = `
    UPDATE dishes
    SET ${updates.join(", ")}
    WHERE id = ?
  `;

  try {
    const [result] = await pool.execute(query, values);
    if (result.affectedRows === 0) {
      throw new Error("Dish not found");
    }
    return { message: "Dish updated successfully" };
  } catch (error) {
    console.error("Error updating dish:", error);
    throw new Error("Database error: Could not update dish");
  }
};

module.exports = {
  addDish,
  getDishesByRestaurantId,
  deleteDishById,
  updateDishById,
};
