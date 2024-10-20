const express = require("express"); // Import express
const cors = require("cors"); // Import CORS for handling cross-origin requests
const bodyParser = require("body-parser"); // Parse incoming request bodies

const app = express(); // Initialize express app

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON requests

// Import routes
const authRoutes = require("./routes/authRoutes"); // Adjust path as necessary

// Use routes
app.use("/auth", authRoutes); // Define endpoint for authentication

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
