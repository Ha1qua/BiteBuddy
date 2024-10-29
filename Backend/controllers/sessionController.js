// controllers/sessionController.js
const {
  storeSession,
  deleteExpiredSessions,
} = require("../models/sessionModel");

const storeTableNumber = async (req, res) => {
  const { tableNumber } = req.body;

  try {
    await storeSession(tableNumber);
    res.status(201).json({ message: "Table number stored" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "This table number is already in use." });
    } else {
      console.error("Error storing table number:", error);
      res.status(500).json({ error: "Failed to store table number" });
    }
  }
};

// Run the cleanup every minute
const scheduleCleanup = () => {
  setInterval(async () => {
    try {
      await deleteExpiredSessions();
      console.log("Expired sessions deleted");
    } catch (error) {
      console.error("Error deleting expired sessions:", error);
    }
  }, 60000); // Every 1 minute
};

module.exports = { storeTableNumber, scheduleCleanup };
