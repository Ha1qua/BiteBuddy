const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const authRoutes = require("./routes/authRoutes");
const dishRoutes = require("./routes/dishRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const { scheduleCleanup } = require("./controllers/sessionController");
const orderRoutes = require("./routes/orderRoutes");
const chefRoutes = require("./routes/chefRoutes");

// Use routes
app.use("/auth", authRoutes);
app.use("/dishes", dishRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chef", chefRoutes);
// Start scheduled cleanup for expired sessions
scheduleCleanup();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
