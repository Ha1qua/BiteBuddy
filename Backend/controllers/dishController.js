const dishModel = require("../models/dishModel");

// Controller to add a new dish
const createDish = async (req, res) => {
  try {
    const { dishName, price, ingredients, imageUrl, restaurant_id } = req.body;

    if (!dishName || !price || !ingredients || !imageUrl || !restaurant_id) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const dishId = await dishModel.addDish({
      dishName,
      price,
      ingredients,
      image: imageUrl,
      restaurant_id,
    });

    res.status(201).json({ id: dishId, message: "Dish added successfully" });
  } catch (error) {
    console.error("Error adding dish:", error);
    res.status(500).send("Error adding dish");
  }
};

// Controller to get dishes by restaurant ID
const fetchDishesByRestaurant = async (req, res) => {
  try {
    const dishes = await dishModel.getDishesByRestaurantId(
      req.params.restaurantId
    );
    res.json(dishes);
  } catch (error) {
    console.error("Error fetching dishes:", error);
    res.status(500).send("Error fetching dishes");
  }
};

// Controller to delete a dish by ID
const deleteDish = async (req, res) => {
  try {
    const result = await dishModel.deleteDishById(req.params.id);
    res.json(result);
  } catch (error) {
    console.error("Error deleting dish:", error);
    res.status(500).json({ error: error.message });
  }
};

// Controller to update a dish by ID
const updateDish = async (req, res) => {
  try {
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
  }
};

module.exports = {
  createDish,
  fetchDishesByRestaurant,
  deleteDish,
  updateDish,
};
