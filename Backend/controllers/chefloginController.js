const ChefLogin = require("../models/chefloginModel");
const db = require("../services/db");

const verifyRestaurantId = async (req, res) => {
  const { restaurantId } = req.body;
  let connection;

  if (!restaurantId) {
    return res
      .status(400)
      .json({ success: false, message: "Restaurant ID is required" });
  }

  try {
    connection = await db.getConnection(); // Get a connection from the pool

    const isValid = await ChefLogin.verifyRestaurantId(restaurantId);

    // Log the test case to connection_tests
    await connection.query("DELETE FROM connection_tests WHERE test_name = ?", [
      "Chef login",
    ]);

    if (isValid) {
      await connection.query(
        "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
        ["Chef login", true]
      );
      return res
        .status(200)
        .json({ success: true, message: "Restaurant ID verified" });
    } else {
      await connection.query(
        "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
        ["Chef login", false]
      );
      return res
        .status(404)
        .json({ success: false, message: "Invalid restaurant ID" });
    }
  } catch (error) {
    console.error("Error verifying restaurant ID:", error);

    // Log the failure in connection_tests
    if (connection) {
      await connection.query(
        "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
        ["Chef login", false]
      );
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  } finally {
    if (connection) {
      connection.release(); // Ensure the connection is released
    }
  }
};

module.exports = { verifyRestaurantId };
