const db = require("../services/db");

const getOrdersForChef = async (req, res) => {
  const { restaurantId } = req.query; // Get the restaurant ID from the query parameters

  if (!restaurantId) {
    return res.status(400).json({
      message: "Restaurant ID is required to fetch orders.",
    });
  }

  try {
    const [rows] = await db.query(
      `
      SELECT 
        o.table_number, 
        d.dishName, 
        od.quantity, 
        o.total_price 
      FROM 
        orders o
      JOIN 
        order_details od ON o.order_id = od.order_id
      JOIN 
        dishes d ON od.dish_id = d.id
      WHERE 
        o.restaurant_id = ? -- Filter by restaurant ID
      ORDER BY 
        o.table_number ASC
      `,
      [restaurantId] // Pass the restaurant ID as a parameter
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching orders for chef:", error);
    res.status(500).json({
      message: "Failed to fetch orders for the chef.",
      error,
    });
  }
};

module.exports = { getOrdersForChef };
