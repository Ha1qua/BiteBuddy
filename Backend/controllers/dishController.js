const dishModel = require("../models/dishModel");
const pool = require("../services/db");

// Controller to add a new dish
const createDish = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    const { dishName, price, ingredients, imageUrl, restaurant_id } = req.body;

    if (!dishName || !price || !ingredients || !imageUrl || !restaurant_id) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Add the dish using the model
    const dishId = await dishModel.addDish({
      dishName,
      price,
      ingredients,
      image: imageUrl,
      restaurant_id,
    });

    // Log the test case to the database
    await connection.query("DELETE FROM connection_tests WHERE test_name = ?", [
      "Dish add",
    ]);
    await connection.query(
      "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
      ["Dish add", true]
    );

    res.status(201).json({ id: dishId, message: "Dish added successfully" });
  } catch (error) {
    console.error("Error adding dish:", error);
    if (connection) {
      await connection.query(
        "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
        ["Dish add", false]
      );
    }
    res.status(500).send("Error adding dish");
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
};

// Controller to get dishes by restaurant ID
const fetchDishesByRestaurant = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    const dishes = await dishModel.getDishesByRestaurantId(
      req.params.restaurantId
    );
    res.json(dishes);
  } catch (error) {
    console.error("Error fetching dishes:", error);
    res.status(500).send("Error fetching dishes");
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
};

// Controller to delete a dish by ID
const deleteDish = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    const result = await dishModel.deleteDishById(req.params.id);
    res.json(result);
  } catch (error) {
    console.error("Error deleting dish:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
};

// Controller to update a dish by ID
const updateDish = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    const dishId = req.params.id;
    const { dishName, price, ingredients, imageUrl, restaurant_id } = req.body;

    if (!dishName && !price && !ingredients && !imageUrl && !restaurant_id) {
      return res.status(400).json({ error: "At least one field is required." });
    }

    const result = await dishModel.updateDishById(dishId, {
      dishName,
      price,
      ingredients,
      image: imageUrl,
      restaurant_id,
    });

    res.json(result);
  } catch (error) {
    console.error("Error updating dish:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
};

module.exports = {
  createDish,
  fetchDishesByRestaurant,
  deleteDish,
  updateDish,
};
