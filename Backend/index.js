const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize the Express app
const app = express();

// Middleware
app.use(cors()); // Handle cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies

// Import routes
const authRoutes = require("./routes/authRoutes");
const dishRoutes = require("./routes/dishRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const orderRoutes = require("./routes/orderRoutes");
const chefRoutes = require("./routes/chefRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const chefloginRoutes = require("./routes/chefloginRoutes");

// Import controllers
const { scheduleCleanup } = require("./controllers/sessionController");

// Use routes
app.use("/auth", authRoutes);
app.use("/dishes", dishRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chef", chefRoutes);
app.use("/api", reviewRoutes); // Add the new food reviews route
app.use("/api", chefloginRoutes);

// Start scheduled cleanup for expired sessions
scheduleCleanup();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
