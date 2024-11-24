const ChefLogin = require("../models/chefloginModel");

const verifyRestaurantId = async (req, res) => {
  const { restaurantId } = req.body;

  if (!restaurantId) {
    return res
      .status(400)
      .json({ success: false, message: "Restaurant ID is required" });
  }

  try {
    const isValid = await ChefLogin.verifyRestaurantId(restaurantId);
    if (isValid) {
      return res
        .status(200)
        .json({ success: true, message: "Restaurant ID verified" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Invalid restaurant ID" });
    }
  } catch (error) {
    console.error("Error verifying restaurant ID:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = { verifyRestaurantId };
