const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const initSocket = require("./socketServer"); // Import the socket server setup

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const authRoutes = require("./routes/authRoutes");
const dishRoutes = require("./routes/dishRoutes");
// const sessionRoutes = require("./routes/sessionRoutes");
const orderRoutes = require("./routes/orderRoutes");
const chefRoutes = require("./routes/chefRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const chefloginRoutes = require("./routes/chefloginRoutes");
const testcaseRoutes = require("./routes/testcaseRoutes");

// Import controllers
const { scheduleCleanup } = require("./controllers/sessionController");

// Use routes
app.use("/auth", authRoutes);
app.use("/dishes", dishRoutes);
// app.use("/api/sessions", sessionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chef", chefRoutes);
app.use("/api", reviewRoutes);
app.use("/api", chefloginRoutes);
app.use(testcaseRoutes);

// Start scheduled cleanup for expired sessions
scheduleCleanup();

// Create an HTTP server using Express
const server = http.createServer(app);

// Initialize Socket.io with the HTTP server
initSocket(server);

if (require.main === module) {
  // Only start the server if this file is run directly
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export the app for testing
module.exports = app;
